import { z } from "zod";
import { Pitch, KeyQuality } from "@/generated/prisma/enums";

export const PITCH_LABELS: Record<Pitch, string> = {
  C: "C",
  C_SHARP: "C#",
  D_FLAT: "Db",
  D: "D",
  D_SHARP: "D#",
  E_FLAT: "Eb",
  E: "E",
  F: "F",
  F_SHARP: "F#",
  G_FLAT: "Gb",
  G: "G",
  G_SHARP: "G#",
  A_FLAT: "Ab",
  A: "A",
  A_SHARP: "A#",
  B_FLAT: "Bb",
  B: "B",
};

export type KeyOption = {
  pitch: Pitch
  quality: KeyQuality
  label: string
};

export const KEY_OPTIONS: KeyOption[] = [
  { pitch: "C", quality: "MAJOR", label: "C" },
  { pitch: "C", quality: "MINOR", label: "Cm" },
  { pitch: "C_SHARP", quality: "MAJOR", label: "C#" },
  { pitch: "C_SHARP", quality: "MINOR", label: "C#m" },
  { pitch: "D_FLAT", quality: "MAJOR", label: "Db" },
  { pitch: "D", quality: "MAJOR", label: "D" },
  { pitch: "D", quality: "MINOR", label: "Dm" },
  { pitch: "D_SHARP", quality: "MINOR", label: "D#m" },
  { pitch: "E_FLAT", quality: "MAJOR", label: "Eb" },
  { pitch: "E_FLAT", quality: "MINOR", label: "Ebm" },
  { pitch: "E", quality: "MAJOR", label: "E" },
  { pitch: "E", quality: "MINOR", label: "Em" },
  { pitch: "F", quality: "MAJOR", label: "F" },
  { pitch: "F", quality: "MINOR", label: "Fm" },
  { pitch: "F_SHARP", quality: "MAJOR", label: "F#" },
  { pitch: "F_SHARP", quality: "MINOR", label: "F#m" },
  { pitch: "G_FLAT", quality: "MAJOR", label: "Gb" },
  { pitch: "G", quality: "MAJOR", label: "G" },
  { pitch: "G", quality: "MINOR", label: "Gm" },
  { pitch: "G_SHARP", quality: "MINOR", label: "G#m" },
  { pitch: "A_FLAT", quality: "MAJOR", label: "Ab" },
  { pitch: "A", quality: "MAJOR", label: "A" },
  { pitch: "A", quality: "MINOR", label: "Am" },
  { pitch: "A_SHARP", quality: "MINOR", label: "A#m" },
  { pitch: "B_FLAT", quality: "MAJOR", label: "Bb" },
  { pitch: "B_FLAT", quality: "MINOR", label: "Bbm" },
  { pitch: "B", quality: "MAJOR", label: "B" },
  { pitch: "B", quality: "MINOR", label: "Bm" },
];

export const formatKey = (pitch: Pitch, quality: KeyQuality) => {
  return `${PITCH_LABELS[pitch]}${quality === "MINOR" ? "m" : ""}`
};

export const encodeKey = (pitch: Pitch, quality: KeyQuality) =>
  `${pitch}|${quality}`

export const decodeKey = (encoded: string): { pitch: Pitch; quality: KeyQuality } => {
  const [pitch, quality] = encoded.split("|")
  return { pitch: pitch as Pitch, quality: quality as KeyQuality }
};

export const pitchSchema = z.enum(Pitch);
export const keyQualitySchema = z.enum(KeyQuality);
export type { Pitch, KeyQuality };