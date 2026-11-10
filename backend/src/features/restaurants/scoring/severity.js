// Severity of one inspection, 0 (clean) to 100 (serious problems).
// Each failed violation adds points by its official level, with extra weight for the two
// things that most directly make people sick: pests and unsafe food temperatures.
export const LEVEL_POINTS = Object.freeze({ Minor: 2, Moderate: 5, Serious: 10 });
export const CATEGORY_MULTIPLIER = Object.freeze({ pests: 1.6, temperature: 1.3 });

export function scoreInspection(violations) {
  const raw = violations.reduce(
    (sum, v) => sum + (LEVEL_POINTS[v.level] ?? 0) * (CATEGORY_MULTIPLIER[v.category] ?? 1),
    0,
  );
  return Math.min(100, Math.round(raw));
}

// A kitchen's headline score: the worst of its three most recent inspections. A quick, clean
// re-check right after a failed inspection shouldn't make the failure disappear.
// On Boston data since 2023 this puts ~75% of kitchens under 20, ~22% at 20-49 and ~3% at 50+.
export function headlineScore(inspectionsNewestFirst) {
  const recent = inspectionsNewestFirst.slice(0, 3);
  if (recent.length === 0) return null;
  return Math.max(...recent.map((i) => i.severityScore));
}
