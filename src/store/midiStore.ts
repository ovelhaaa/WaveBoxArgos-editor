import { create } from 'zustand';
import { midiAdapter } from '../midi/adapter';
import type { MidiMessage } from '../midi/protocol';

interface MidiState {
  isSupported: boolean;
  isConnected: boolean;
  inputs: any[];
  outputs: any[];
  selectedPortId: string | null;
  midiLogs: MidiMessage[];
  rxChannel: number | 'ALL' | 'OFF';
  txChannel: number | 'ALL' | 'OFF';

  initialize: () => Promise<void>;
  connectPort: (portId: string) => Promise<void>;
  disconnectPort: () => void;
  clearLogs: () => void;
  setRxChannel: (ch: number | 'ALL' | 'OFF') => void;
  setTxChannel: (ch: number | 'ALL' | 'OFF') => void;
}

export const useMidiStore = create<MidiState>((set) => ({
  isSupported: 'requestMIDIAccess' in navigator,
  isConnected: false,
  inputs: [],
  outputs: [],
  selectedPortId: null,
  midiLogs: [],
  rxChannel: 1, // Default MIDI channel 1
  txChannel: 1, // Default MIDI channel 1

  initialize: async () => {
    try {
      await midiAdapter.initialize();
      set({
        inputs: midiAdapter.getInputs(),
        outputs: midiAdapter.getOutputs()
      });

      midiAdapter.onConnectionStateChange = () => {
        set({
          inputs: midiAdapter.getInputs(),
          outputs: midiAdapter.getOutputs()
        });
      };

      midiAdapter.onMessageReceived = (msg) => {
        set((state) => ({
          midiLogs: [msg, ...state.midiLogs].slice(0, 100) // Keep last 100 messages
        }));
      };
    } catch (error) {
      console.error('Failed to initialize MIDI:', error);
      set({ isSupported: false });
    }
  },

  connectPort: async (portId: string) => {
    try {
      await midiAdapter.connect(portId);
      set({ isConnected: true, selectedPortId: portId });
    } catch (error) {
      console.error('Failed to connect to MIDI port:', error);
      set({ isConnected: false, selectedPortId: null });
    }
  },

  disconnectPort: () => {
    midiAdapter.disconnect();
    set({ isConnected: false, selectedPortId: null });
  },

  clearLogs: () => {
    set({ midiLogs: [] });
  },

  setRxChannel: (ch) => set({ rxChannel: ch }),
  setTxChannel: (ch) => {
    set({ txChannel: ch });
    if (typeof ch === 'number') {
      midiAdapter.setMidiChannel(ch);
    }
  }
}));
