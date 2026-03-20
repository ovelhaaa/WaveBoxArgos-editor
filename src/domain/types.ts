import { z } from 'zod';

export type ArgosMode = 'PRESET' | 'PEDAL';
export type PresetNumber = number; // 1 to 40
export type PresetBank = 'A' | 'B';
export type PedalChannel = 1 | 2 | 3;
export type MidiRole = 'MASTER' | 'SLAVE';
export type MidiChannel = number | 'ALL' | 'OFF'; // 1 to 16

export const AmpModelSchema = z.enum(['Fender', 'Marshall', 'MesaBoogie']);
export type AmpModel = z.infer<typeof AmpModelSchema>;

export const GainModeSchema = z.enum(['Baixo', 'Alto', 'Tube']);
export type GainMode = z.infer<typeof GainModeSchema>;

export const MicPositionSchema = z.enum(['Borda', 'Centro', 'Distante']);
export type MicPosition = z.infer<typeof MicPositionSchema>;

export const OnOffSchema = z.enum(['Ligado', 'Desligado']);
export type OnOff = z.infer<typeof OnOffSchema>;

export const PresetParametersSchema = z.object({
  level: z.number().min(0).max(100), // 0 to 100%
  drive: z.number().min(0).max(100), // 0 to 100%
  treble: z.number().min(-12).max(12), // -12dB to +12dB
  sweep: z.number().min(400).max(3700), // 400Hz to 3.7KHz
  middle: z.number().min(-10).max(10), // -10dB to +10dB
  bass: z.number().min(-15).max(15), // -15dB to +15dB
  amp: AmpModelSchema,
  gain: GainModeSchema,
  mic: MicPositionSchema,
  switch: OnOffSchema,
  bypass: OnOffSchema,
});

export type PresetParameters = z.infer<typeof PresetParametersSchema>;

export interface Preset {
  id: string; // Internal ID
  number: PresetNumber;
  bank: PresetBank;
  name: string; // User-friendly name
  parameters: PresetParameters;
  isFactory: boolean;
}

export const defaultParameters: PresetParameters = {
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
  bypass: 'Desligado',
};
