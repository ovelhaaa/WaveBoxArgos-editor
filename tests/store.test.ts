import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../src/store/editorStore';
import { useLibraryStore } from '../src/store/libraryStore';

describe('Stores', () => {
  beforeEach(() => {
    useEditorStore.setState({ isDirty: false, currentPresetNumber: 1 });
    useLibraryStore.setState({ presets: [] });
  });

  it('editorStore becomes dirty when a parameter is set', () => {
    const store = useEditorStore.getState();
    expect(store.isDirty).toBe(false);

    store.setParameter('drive', 75);

    const newStore = useEditorStore.getState();
    expect(newStore.isDirty).toBe(true);
    expect(newStore.parameters.drive).toBe(75);
  });

  it('libraryStore saves presets correctly', () => {
    const store = useLibraryStore.getState();
    const preset = {
      id: 'test-11-A',
      number: 11,
      bank: 'A' as const,
      name: 'Test Preset',
      parameters: {
        level: 50, drive: 50, treble: 0, sweep: 1000, middle: 0, bass: 0,
        amp: 'Fender' as const, gain: 'Baixo' as const, mic: 'Centro' as const, switch: 'Desligado' as const, bypass: 'Desligado' as const
      },
      isFactory: false
    };

    store.savePreset(preset);

    const newStore = useLibraryStore.getState();
    expect(newStore.presets.length).toBe(1);
    expect(newStore.getPreset(11, 'A')).toBeDefined();
  });
});
