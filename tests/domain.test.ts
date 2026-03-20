import { describe, it, expect } from 'vitest';
import { PresetParametersSchema } from '../src/domain/types';

describe('Domain Validations', () => {
  it('should validate correct parameters', () => {
    const validParams = {
      level: 50,
      drive: 50,
      treble: 0,
      sweep: 1000,
      middle: 0,
      bass: 0,
      amp: 'Fender',
      gain: 'Baixo',
      mic: 'Centro',
      switch: 'Desligado',
      bypass: 'Ligado'
    };

    const result = PresetParametersSchema.safeParse(validParams);
    expect(result.success).toBe(true);
  });

  it('should reject out-of-bounds parameters', () => {
    const invalidParams = {
      level: 150, // Max 100
      drive: 50,
      treble: 20, // Max 12
      sweep: 1000,
      middle: 0,
      bass: 0,
      amp: 'Fender',
      gain: 'Baixo',
      mic: 'Centro',
      switch: 'Desligado',
      bypass: 'Ligado'
    };

    const result = PresetParametersSchema.safeParse(invalidParams);
    expect(result.success).toBe(false);
  });
});
