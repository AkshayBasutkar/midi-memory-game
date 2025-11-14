export type MidiNote = {
  readonly midi: number;
  readonly note: string;
  readonly frequency: number;
};


// Difficulty-specific MIDI note mappings
// These mappings prioritize specific MIDI numbers for each difficulty level
// When these run out, the game will use random MIDI numbers from the full mapping

export const EASY_MIDI_MAPPING: readonly MidiNote[] = [
  { midi: 5, note: "B4", frequency: 7040.0 },
  { midi: 2, note: "A4", frequency: 7458.62 },
  { midi: 10, note: "G4", frequency: 7902.13 },
  { midi: 15, note: "D5", frequency: 8372.02 },
  { midi: 6, note: "C5", frequency: 8869.84 },
  { midi: 7, note: "A#4", frequency: 9397.27 },
  { midi: 8, note: "F#4", frequency: 9956.06 },
  { midi: 10, note: "G4", frequency: 10548.08 },
  { midi: 125, note: "F9", frequency: 11175.3 },
  { midi: 126, note: "F#9", frequency: 11839.82 },
  { midi: 127, note: "G9", frequency: 12543.85 },
] as const;

export const MEDIUM_MIDI_MAPPING: readonly MidiNote[] = [
  { midi: 7, note: "E3", frequency: 7040.0 },
  { midi: 26, note: "G#3", frequency: 7458.62 },
  { midi: 63, note: "B3", frequency: 7902.13 },
  { midi: 124, note: "C#4", frequency: 8372.02 },
  { midi: 24, note: "A3", frequency: 8869.84 },
  { midi: 4, note: "F#3", frequency: 9397.27 },
  { midi: 20, note: "G3", frequency: 9956.06 },
  { midi: 36, note: "D4", frequency: 10548.08 },
  { midi: 125, note: "F9", frequency: 11175.3 },
  { midi: 126, note: "F#9", frequency: 11839.82 },
  { midi: 127, note: "G9", frequency: 12543.85 },
] as const;

export const HARD_MIDI_MAPPING: readonly MidiNote[] = [
  { midi: 33, note: "F4", frequency: 7040.0 },
  { midi: 7, note: "C#5", frequency: 7458.62 },
  { midi: 1, note: "E4", frequency: 7902.13 },
  { midi: 72, note: "G4", frequency: 8372.02 },
  { midi: 13, note: "A#4", frequency: 8869.84 },
  { midi: 6, note: "D#4", frequency: 9397.27 },
  { midi: 15, note: "F#4", frequency: 9956.06 },
  { midi: 13, note: "A#4", frequency: 10548.08 },
  { midi: 125, note: "F9", frequency: 11175.3 },
  { midi: 126, note: "F#9", frequency: 11839.82 },
  { midi: 127, note: "G9", frequency: 12543.85 },
] as const;

// Separate functions for each difficulty level
export const getEasyMapping = (): readonly MidiNote[] => {
  return EASY_MIDI_MAPPING;
};

export const getMediumMapping = (): readonly MidiNote[] => {
  return MEDIUM_MIDI_MAPPING;
};

export const getHardMapping = (): readonly MidiNote[] => {
  return HARD_MIDI_MAPPING;
};

// Helper function to get difficulty-specific mapping (for backward compatibility)
export const getDifficultyMapping = (difficulty: "easy" | "medium" | "hard"): readonly MidiNote[] => {
  switch (difficulty) {
    case "easy":
      return getEasyMapping();
    case "medium":
      return getMediumMapping();
    case "hard":
      return getHardMapping();
  }
};

// Combined mapping for fallback (all unique MIDI numbers from all difficulty mappings)
export const getAllAvailableMIDINumbers = (): readonly number[] => {
  const allMidis = new Set<number>();
  EASY_MIDI_MAPPING.forEach(m => allMidis.add(m.midi));
  MEDIUM_MIDI_MAPPING.forEach(m => allMidis.add(m.midi));
  HARD_MIDI_MAPPING.forEach(m => allMidis.add(m.midi));
  return Array.from(allMidis);
};