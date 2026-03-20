import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Preset } from '../domain/types';
import { defaultParameters } from '../domain/types';

interface LibraryState {
  presets: Preset[];
  savePreset: (preset: Preset) => void;
  getPreset: (number: number, bank: 'A' | 'B') => Preset | undefined;
  initializeFactoryPresets: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      presets: [],

      savePreset: (preset) => {
        set((state) => {
          const newPresets = state.presets.filter(
            p => !(p.number === preset.number && p.bank === preset.bank)
          );
          return { presets: [...newPresets, preset] };
        });
      },

      getPreset: (number, bank) => {
        return get().presets.find(p => p.number === number && p.bank === bank);
      },

      initializeFactoryPresets: () => {
        set((state) => {
          if (state.presets.length > 0) return state; // Already initialized

          const factoryPresets: Preset[] = [];
          for (let i = 1; i <= 10; i++) {
            factoryPresets.push({
              id: `factory-${i}-A`,
              number: i,
              bank: 'A',
              name: `Factory Preset ${i}A`,
              parameters: { ...defaultParameters },
              isFactory: true
            });
            factoryPresets.push({
              id: `factory-${i}-B`,
              number: i,
              bank: 'B',
              name: `Factory Preset ${i}B`,
              parameters: { ...defaultParameters },
              isFactory: true
            });
          }
          return { presets: factoryPresets };
        });
      }
    }),
    {
      name: 'argos-preset-library'
    }
  )
);
