import type { ArgosProtocol, MidiMessage } from './protocol';
import type { Preset, PresetParameters, PresetNumber } from '../domain/types';

export class ArgosMidiAdapter implements ArgosProtocol {
  private midiAccess: MIDIAccess | null = null;
  private output: MIDIOutput | null = null;
  private input: MIDIInput | null = null;

  // Keep track of the currently selected MIDI channel (1-16)
  private channel: number = 0; // 0-indexed for MIDI messages (0 = channel 1)

  // Callbacks
  public onMessageReceived?: (msg: MidiMessage) => void;
  public onConnectionStateChange?: () => void;

  constructor() {
    this.handleMidiMessage = this.handleMidiMessage.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  async initialize(): Promise<MIDIAccess> {
    if (!navigator.requestMIDIAccess) {
      throw new Error('Web MIDI API is not supported in this browser.');
    }

    this.midiAccess = await navigator.requestMIDIAccess({ sysex: true });
    this.midiAccess.onstatechange = this.handleStateChange;
    return this.midiAccess;
  }

  getInputs(): MIDIInput[] {
    if (!this.midiAccess) return [];
    return Array.from(this.midiAccess.inputs.values());
  }

  getOutputs(): MIDIOutput[] {
    if (!this.midiAccess) return [];
    return Array.from(this.midiAccess.outputs.values());
  }

  async connect(portId: string): Promise<void> {
    if (!this.midiAccess) {
      await this.initialize();
    }

    // Connect output
    const outputs = this.getOutputs();
    const targetOutput = outputs.find(o => o.id === portId);
    if (targetOutput) {
      this.output = targetOutput;
    }

    // Connect input for monitoring
    const inputs = this.getInputs();
    const targetInput = inputs.find(i => i.id === portId);

    // Disconnect old input if exists
    if (this.input) {
      this.input.onmidimessage = null;
    }

    if (targetInput) {
      this.input = targetInput;
      this.input.onmidimessage = this.handleMidiMessage;
    }

    if (this.onConnectionStateChange) {
      this.onConnectionStateChange();
    }
  }

  disconnect(): void {
    this.output = null;
    if (this.input) {
      this.input.onmidimessage = null;
      this.input = null;
    }
    if (this.onConnectionStateChange) {
      this.onConnectionStateChange();
    }
  }

  setMidiChannel(channel: number): void {
    // channel should be 1-16
    this.channel = Math.max(0, Math.min(15, channel - 1));
  }

  // --- Argos Protocol Implementation --- //

  selectPreset(presetNumber: PresetNumber): void {
    if (!this.output) return;

    // Program Change message: 0xC0 to 0xCF depending on channel
    // Preset numbers 1-40 map to Program Change 0-39 (0-indexed in MIDI, usually)
    // The manual says PC 1-40 maps to Preset 1-40.
    const pcStatus = 0xC0 | this.channel;
    const pcValue = Math.max(0, Math.min(127, presetNumber - 1));

    this.sendMidi([pcStatus, pcValue]);
  }

  setParameter(paramName: keyof PresetParameters, value: number): void {
    if (!this.output) return;

    // TODO: The manual specifies that CC can be used for Volume and Expression,
    // but the exact CC numbers for EACH parameter (Drive, Treble, etc.) are NOT documented clearly,
    // only that "Expression" can control them.
    // For V1, we log this and use placeholder CC numbers.
    const ccMap: Record<keyof PresetParameters, number> = {
      level: 7, // Volume CC
      drive: 11, // Expression CC (Placeholder for V1, needs hardware test)
      treble: 14, // Placeholder CC
      sweep: 15, // Placeholder CC
      middle: 16, // Placeholder CC
      bass: 17, // Placeholder CC
      amp: 18, // Placeholder CC
      gain: 19, // Placeholder CC
      mic: 20, // Placeholder CC
      switch: 21, // Placeholder CC
      bypass: 22, // Placeholder CC
    };

    const ccNumber = ccMap[paramName];
    if (ccNumber !== undefined) {
      const ccStatus = 0xB0 | this.channel;
      // Value must be mapped to 0-127
      const ccValue = this.mapParameterValueToMidi(paramName, value);
      this.sendMidi([ccStatus, ccNumber, ccValue]);
    }
  }

  // V1 Stub for readPreset
  // TODO: Reverse engineer SysEx protocol for reading full preset state
  async readPreset(_presetNumber: number, _bank: 'A' | 'B'): Promise<Preset | null> {
    console.warn('readPreset is a stub in V1. Hardware SysEx protocol is unknown.');
    return null; // Local library should be used instead
  }

  // V1 Stub for writePreset
  // TODO: Reverse engineer SysEx protocol for writing full preset state
  async writePreset(_preset: Preset): Promise<void> {
    console.warn('writePreset is a stub in V1. Hardware SysEx protocol is unknown.');
    // In a real scenario, this might send a SysEx dump to the pedal.
  }

  // --- Internal Utilities --- //

  private mapParameterValueToMidi(paramName: keyof PresetParameters, value: number): number {
    // Map domain values back to 0-127 MIDI range
    // E.g., treble -12 to 12 -> 0 to 127
    switch (paramName) {
      case 'level':
      case 'drive':
        // 0-100 to 0-127
        return Math.floor((value / 100) * 127);
      case 'treble':
        // -12 to +12
        return Math.floor(((value + 12) / 24) * 127);
      case 'middle':
        // -10 to +10
        return Math.floor(((value + 10) / 20) * 127);
      case 'bass':
        // -15 to +15
        return Math.floor(((value + 15) / 30) * 127);
      case 'sweep':
        // 400 to 3700
        return Math.floor(((value - 400) / (3700 - 400)) * 127);
      case 'amp':
      case 'gain':
      case 'mic':
        // 0, 1, 2 mapping
        return Math.floor((value / 2) * 127); // Assuming value here is index 0-2 from UI layer
      case 'switch':
      case 'bypass':
        return value > 0 ? 127 : 0;
      default:
        return 0;
    }
  }

  private sendMidi(data: number[]): void {
    if (this.output) {
      try {
        this.output.send(data);
      } catch (err) {
        console.error('Error sending MIDI message:', err);
      }
    }
  }

  private handleStateChange(_event: MIDIConnectionEvent): void {
    if (this.onConnectionStateChange) {
      this.onConnectionStateChange();
    }
  }

  private handleMidiMessage(event: MIDIMessageEvent): void {
    if (!this.onMessageReceived || !event.data) return;

    const status = event.data[0];
    const typeByte = status & 0xF0;
    const channel = status & 0x0F;
    const data = Array.from(event.data as Iterable<number>);

    let type: MidiMessage['type'] = 'unknown';
    if (typeByte === 0x90 && data[2] > 0) type = 'noteon';
    else if (typeByte === 0x80 || (typeByte === 0x90 && data[2] === 0)) type = 'noteoff';
    else if (typeByte === 0xB0) type = 'cc';
    else if (typeByte === 0xC0) type = 'pc';
    else if (status === 0xF0) type = 'sysex';

    this.onMessageReceived({
      type,
      channel,
      data,
      timestamp: event.timeStamp
    });
  }
}

// Singleton instance
export const midiAdapter = new ArgosMidiAdapter();
