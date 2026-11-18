import { severityLevel } from '../../utils/severity.js';

// A visit "loved it" at 4+ stars, and the kitchen was "clean" below the medium severity line (20).
const LOVED_FROM = 4;
const CONCERNS_FROM = 20;

export const QUADRANTS = [
  { key: 'keepers', label: 'Keepers', hint: 'Loved it, clean kitchen' },
  {
    key: 'second-look',
    label: 'Worth a second look',
    hint: 'Loved it, but the kitchen had concerns',
  },
  { key: 'forgettable', label: 'Clean but forgettable', hint: 'Clean kitchen, food was just okay' },
  { key: 'skip', label: 'Skip next time', hint: 'Not loved, and the kitchen had concerns' },
];

export function quadrantOf(visit) {
  const score = visit.inspectionAtVisit?.severityScore;
  if (score == null || visit.rating == null) return 'unrated';
  const loved = visit.rating >= LOVED_FROM;
  const clean = score < CONCERNS_FROM;
  if (loved) return clean ? 'keepers' : 'second-look';
  return clean ? 'forgettable' : 'skip';
}

// Piecewise scales put the quadrant lines exactly in the middle of the map.
// x: 1 star at the left edge, 5 stars at the right, the "loved" line (3.5) in the centre.
function xFor(rating) {
  rating = Math.max(1, Math.min(rating, 5));
  const mid = LOVED_FROM - 0.5;
  return rating <= mid
    ? 8 + ((rating - 1) / (mid - 1)) * 42
    : 50 + ((rating - mid) / (5 - mid)) * 42;
}

// y: a clean kitchen (0) at the top, 100 at the bottom, the concerns line (20) in the centre.
// Square root in the clean half, so 0 and 2 (both common) don't sit on top of each other.
function yFor(score) {
  const s = Math.min(score, 100);
  return s < CONCERNS_FROM
    ? 18 + Math.sqrt(s / CONCERNS_FROM) * 32
    : 50 + ((s - CONCERNS_FROM) / 80) * 40;
}

// Gap in px between visits that land on the same spot: wider than a dot, so each stays tappable.
const FAN_PX = 24;

// Positions in percent, plus a px nudge for repeats. Repeats fan out toward the centre of the
// map (three per row) so a dot near an edge is never pushed outside it.
export function plotVisits(visits) {
  const seen = new Map();
  return visits
    .filter((v) => quadrantOf(v) !== 'unrated')
    .map((visit) => {
      const score = visit.inspectionAtVisit.severityScore;
      const spot = `${visit.rating}:${score}`;
      const n = seen.get(spot) ?? 0;
      seen.set(spot, n + 1);
      const x = xFor(visit.rating);
      const y = yFor(score);
      return {
        visit,
        level: severityLevel(score),
        x,
        y,
        dx: (x > 50 ? -1 : 1) * (n % 3) * FAN_PX,
        dy: (y > 50 ? -1 : 1) * Math.floor(n / 3) * FAN_PX,
      };
    });
}
