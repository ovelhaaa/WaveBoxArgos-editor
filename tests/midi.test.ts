import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ArgosMidiAdapter } from '../src/midi/adapter';

describe('MidiAdapter', () => {
  let adapter: ArgosMidiAdapter;

  beforeEach(() => {
    adapter = new ArgosMidiAdapter();
    // Use prototype to access private method for testing purpose
    adapter['output'] = {
      send: vi.fn(),
      id: 'test-port',
      name: 'Test Port',
      state: 'connected',
      connection: 'open',
      type: 'output',
      version: '1',
      manufacturer: 'Test',
      open: vi.fn(),
      close: vi.fn(),
      onstatechange: null,
      clear: vi.fn()
    } as unknown as WebMidi.MIDIOutput;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends correct PC message on selectPreset', () => {
    adapter.selectPreset(5); // Preset 5 => PC 4
    expect(adapter['output']!.send).toHaveBeenCalledWith([0xC0, 4]);
  });

  it('maps parameter values correctly to 0-127 MIDI range', () => {
    const map = adapter['mapParameterValueToMidi'].bind(adapter);

    expect(map('level', 100)).toBe(127);
    expect(map('level', 50)).toBe(63);
    expect(map('level', 0)).toBe(0);

    expect(map('treble', 12)).toBe(127);
    expect(map('treble', 0)).toBe(63);
    expect(map('treble', -12)).toBe(0);

    expect(map('bass', 15)).toBe(127);
    expect(map('bass', -15)).toBe(0);

    expect(map('sweep', 3700)).toBe(127);
    expect(map('sweep', 400)).toBe(0);

    // Switches
    expect(map('switch', 127)).toBe(127);
    expect(map('switch', 0)).toBe(0);
  });
});
