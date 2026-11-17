import { CATEGORY_KEYS } from './severity.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const time = (value) => new Date(value).getTime();

// Serious violations in the year before the latest inspection (inspections are newest first).
export function seriousInPastYear(inspections) {
  if (inspections.length === 0) return 0;
  const since = time(inspections[0].date) - 365 * DAY_MS;
  return inspections
    .filter((inspection) => time(inspection.date) > since)
    .flatMap((inspection) => inspection.violations)
    .filter((violation) => violation.level === 'Serious').length;
}

// For each violation category: how often it was cited and when it was last cited.
// Returns { cited: [{ key, count, last }] (most recent first), never: [key] }.
export function problemAreas(inspections) {
  const byKey = new Map();
  for (const inspection of inspections) {
    for (const violation of inspection.violations) {
      const entry = byKey.get(violation.category) ?? { key: violation.category, count: 0, last: 0 };
      entry.count += 1;
      entry.last = Math.max(entry.last, time(inspection.date));
      byKey.set(violation.category, entry);
    }
  }
  return {
    cited: [...byKey.values()].sort((a, b) => b.last - a.last),
    never: CATEGORY_KEYS.filter((key) => !byKey.has(key)),
  };
}

// "today", "12 days ago", "5 months ago", "2 years ago"
export function timeAgo(value, now = Date.now()) {
  const days = Math.max(0, Math.round((now - time(value)) / DAY_MS));
  if (days === 0) return 'today';
  if (days < 60) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.round(days / 30.4);
  if (months < 24) return `${months} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
