export const OBJECTIVES = [
  { code: "persuasive", label: "More persuasive", icon: "mdi:scale-balance" },
  { code: "professional", label: "More professional", icon: "mdi:briefcase-outline" },
  { code: "engaging", label: "More engaging", icon: "mdi:account-group-outline" },
  { code: "concise", label: "More concise", icon: "mdi:text-short" },
  { code: "confident", label: "More confident", icon: "mdi:arm-flex-outline" },
  { code: "clear", label: "Clearer", icon: "mdi:lightbulb-on-outline" },
];

// 16 kHz mono 16-bit WAV stays below Gemma 4 E2B's 3.5 MB request limit
// after base64 encoding and adding the feedback prompt.
export const MAX_RECORDING_SECONDS = 70;

export const buildObjective = (objectiveLabel, audience) => {
  const parts = [];
  if (objectiveLabel) parts.push(`be ${objectiveLabel.toLowerCase()}`);
  if (audience?.trim()) parts.push(`suit this audience: ${audience.trim()}`);
  return parts.join(", and ") || "";
};
