// Improving / Steady / Slipping from the trend of severity over the last six inspections.
// Fits a straight line through the scores; if the fitted change across that window is at
// least THRESHOLD points better (lower) or worse (higher), the kitchen is moving.
export const TRAJECTORIES = Object.freeze(['Improving', 'Steady', 'Slipping']);

const WINDOW = 6;
const MIN_INSPECTIONS = 3;
const THRESHOLD = 8;

export function computeTrajectory(inspectionsOldestFirst) {
  const scores = inspectionsOldestFirst.slice(-WINDOW).map((i) => i.severityScore);
  if (scores.length < MIN_INSPECTIONS) return null;

  const n = scores.length;
  const meanX = (n - 1) / 2;
  const meanY = scores.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  scores.forEach((y, x) => {
    num += (x - meanX) * (y - meanY);
    den += (x - meanX) ** 2;
  });
  const change = (num / den) * (n - 1);

  if (change <= -THRESHOLD) return 'Improving';
  if (change >= THRESHOLD) return 'Slipping';
  return 'Steady';
}
