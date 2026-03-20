import { create } from 'zustand';
import type { Preset, PresetParameters } from '../domain/types';
import { defaultParameters } from '../domain/types';
import { midiAdapter } from '../midi/adapter';

interface EditorState {
  currentPresetNumber: number;
  currentBank: 'A' | 'B';
  parameters: PresetParameters;
  isDirty: boolean;

  selectPreset: (num: number, bank: 'A' | 'B') => void;
  setParameter: (key: keyof PresetParameters, value: number | string) => void;
  loadPreset: (preset: Preset) => void;
  markSaved: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentPresetNumber: 1,
  currentBank: 'A',
  parameters: { ...defaultParameters },
  isDirty: false,

  selectPreset: (num, bank) => {
    // Send MIDI PC when selecting preset
    midiAdapter.selectPreset(num);
    set({
      currentPresetNumber: num,
      currentBank: bank,
      isDirty: false
    });
  },

  setParameter: (key, value) => {
    set((state) => ({
      parameters: {
        ...state.parameters,
        [key]: value
      },
      isDirty: true
    }));

    // Send CC update based on parameter change
    // Using simple conversion for selects/toggles
    let numericValue = 0;
    if (typeof value === 'number') {
      numericValue = value;
    } else if (typeof value === 'string') {
      const optionsMap: Record<string, number> = {
        'Fender': 0, 'Marshall': 1, 'MesaBoogie': 2,
        'Baixo': 0, 'Alto': 1, 'Tube': 2,
        'Borda': 0, 'Centro': 1, 'Distante': 2,
        'Ligado': 127, 'Desligado': 0
      };
      numericValue = optionsMap[value] !== undefined ? optionsMap[value] : 0;
    }

    midiAdapter.setParameter(key, numericValue);
  },

  loadPreset: (preset: Preset) => {
    set({
      currentPresetNumber: preset.number,
      currentBank: preset.bank,
      parameters: { ...preset.parameters },
      isDirty: false
    });
  },

  markSaved: () => {
    set({ isDirty: false });
  }
}));
