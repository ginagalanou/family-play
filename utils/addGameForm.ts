export const supplyPreset = [
  "balloon",
  "paper",
  "tape",
  "string",
  "pillows",
  "dice",
  "cards",
  "spoon",
  "tissue",
  "none",
];

export const agePreset = ["0\u20133", "3\u20135", "6\u20138", "9\u201312", "13+"];

export const playerPreset = ["1", "1-2", "1-4", "2+", "3+", "4+", "5+"];

export const activityPreset = [
  "Physical",
  "Language",
  "Math",
  "Problem-solving",
  "Fine motor",
  "Seated",
  "Creative",
  "Teamwork",
  "Strategy",
  "Calm",
  "Active",
];

export const noisePreset = ["Low", "Moderate", "High"];

export function parseList(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function isSelected(current: string[], option: string) {
  return current.some((value) => value.toLowerCase() === option.toLowerCase());
}

export function toggleChoice(current: string[], option: string) {
  if (isSelected(current, option)) {
    return current.filter((value) => value.toLowerCase() !== option.toLowerCase());
  }
  return [...current, option];
}

export function presetMatches(preset: string[], value: string) {
  return preset.some((option) => option.toLowerCase() === value.toLowerCase());
}
