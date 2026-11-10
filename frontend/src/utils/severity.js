// Maps a 0-100 severity score to a level used for colour and wording.
export function severityLevel(score) {
  if (score >= 50) return 'high';
  if (score >= 20) return 'medium';
  return 'low';
}

// Long form for headline displays ("Some concerns"), short form for badges ("Concerns").
export const SEVERITY_LABELS = {
  low: 'Minor issues',
  medium: 'Some concerns',
  high: 'Serious issues',
};
const SHORT_LABELS = { low: 'Minor', medium: 'Concerns', high: 'Serious' };

export function shortSeverityLabel(score) {
  return score === 0 ? 'Clean' : SHORT_LABELS[severityLevel(score)];
}

// Violation categories as stored by the seed -> what a diner reads.
const CATEGORY_LABELS = {
  pests: 'Pests',
  temperature: 'Food temperature',
  hygiene: 'Staff hygiene',
  contamination: 'Contamination risk',
  cleaning: 'Cleaning & sanitizing',
  plumbing: 'Water & plumbing',
  facility: 'Building & equipment',
  management: 'Management & paperwork',
  chemicals: 'Chemicals',
};

export const categoryLabel = (key) => CATEGORY_LABELS[key] ?? key;
