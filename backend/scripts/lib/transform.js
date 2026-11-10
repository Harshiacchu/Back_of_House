// Turns raw dataset rows (one row per violation line) into restaurants and inspections.
import { neighborhoodOf, titleCase } from '../../src/features/restaurants/neighborhoods.js';
import { headlineScore, scoreInspection } from '../../src/features/restaurants/scoring/severity.js';
import { computeTrajectory } from '../../src/features/restaurants/scoring/trajectory.js';
import { decodeViolation, levelOf } from '../../src/features/restaurants/scoring/violationCodes.js';

// Raw result codes -> what a diner should read. Codes not listed are not real inspections.
const RESULTS = Object.freeze({
  HE_Pass: 'Pass',
  Pass: 'Pass',
  PassViol: 'Pass',
  NoViol: 'Pass',
  HE_Filed: 'Report filed',
  HE_Fail: 'Fail',
  Fail: 'Fail',
  Failed: 'Fail',
  HE_FAILNOR: 'Fail',
  HE_FailExt: 'Fail, given time to fix',
  HE_Hearing: 'Sent to a hearing',
  HE_TSOP: 'Permit suspended',
  HE_Closure: 'Closed by the city',
  HE_VolClos: 'Closed voluntarily',
});

const MAX_COMMENT = 280;

// "ALEX PIZZA" -> "Alex Pizza"; names that already use mixed case are left alone.
function displayName(raw) {
  const name = raw.replace(/\s+/g, ' ').trim();
  if (name !== name.toUpperCase()) return name;
  return titleCase(name)
    .replace(/'S\b/g, "'s")
    .replace(/\b(Bbq|Llc|Inc)\b/g, (w) => w.toUpperCase());
}

function parseLocation(text) {
  const match = /\(\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*\)/.exec(text ?? '');
  if (!match) return null;
  const [lat, lng] = [Number(match[1]), Number(match[2])];
  if (!lat || !lng) return null;
  return { type: 'Point', coordinates: [lng, lat] };
}

function toViolation(row) {
  const level = levelOf(row.viol_level);
  if (!level || row.viol_status !== 'Fail' || !row.violation) return null;
  const { plain, category } = decodeViolation(row.violation, row.violdesc);
  const comment = (row.comments ?? '').replace(/\s+/g, ' ').trim();
  return {
    code: row.violation,
    level,
    plain,
    category,
    description: (row.violdesc ?? '').replace(/\s{2,}/g, ' ').trim(),
    comments: comment.length > MAX_COMMENT ? `${comment.slice(0, MAX_COMMENT - 1)}…` : comment,
  };
}

export function buildRecords(rows) {
  const byLicense = new Map();

  for (const row of rows) {
    const result = RESULTS[row.result];
    if (!result || !row.licenseno || !row.resultdttm) continue;

    let entry = byLicense.get(row.licenseno);
    if (!entry) {
      entry = { latest: row, inspections: new Map() };
      byLicense.set(row.licenseno, entry);
    }
    if (row.resultdttm > entry.latest.resultdttm) entry.latest = row;

    let inspection = entry.inspections.get(row.resultdttm);
    if (!inspection) {
      inspection = { date: new Date(row.resultdttm), result, violations: [], seen: new Set() };
      entry.inspections.set(row.resultdttm, inspection);
    }
    const violation = toViolation(row);
    if (violation && !inspection.seen.has(violation.code)) {
      inspection.seen.add(violation.code);
      inspection.violations.push(violation);
    }
  }

  const restaurants = [];
  for (const [licenseNo, { latest, inspections }] of byLicense) {
    const ordered = [...inspections.values()]
      .sort((a, b) => a.date - b.date)
      .map(({ date, result, violations }) => ({
        date,
        result,
        violations,
        severityScore: scoreInspection(violations),
      }));
    const newestFirst = [...ordered].reverse();
    const last = newestFirst[0];

    restaurants.push({
      restaurant: {
        licenseNo,
        name: displayName(latest.businessname),
        address: titleCase((latest.address ?? '').replace(/\s+/g, ' ').trim()),
        zip: (latest.zip ?? '').trim().slice(0, 5).padStart(5, '0'),
        neighborhood: neighborhoodOf(latest.city, latest.zip),
        category: latest.descript,
        location: parseLocation(latest.location),
        summary: {
          severityScore: headlineScore(newestFirst),
          trajectory: computeTrajectory(ordered),
          lastInspectionDate: last.date,
          lastResult: last.result,
          inspectionCount: ordered.length,
        },
      },
      inspections: newestFirst,
    });
  }
  return restaurants;
}
