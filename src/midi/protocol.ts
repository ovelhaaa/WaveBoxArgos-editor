import type { Preset, PresetParameters } from '../domain/types';

export interface MidiMessage {
  type: 'noteon' | 'noteoff' | 'cc' | 'pc' | 'sysex' | 'unknown';
  channel: number;
  data: number[];
  timestamp: number;
}

export interface ArgosProtocol {
  connect(portId: string): Promise<void>;
  disconnect(): void;
  selectPreset(presetNumber: number): void;
  setParameter(paramName: keyof PresetParameters, value: number): void;
  // readPreset and writePreset are stubs in V1.
  // The actual SysEx/Dump protocol for the hardware is not documented.
  // TODO: Reverse engineer or obtain the actual hardware protocol for dump/sync.
  readPreset(presetNumber: number, bank: 'A' | 'B'): Promise<Preset | null>;
  writePreset(preset: Preset): Promise<void>;
}
