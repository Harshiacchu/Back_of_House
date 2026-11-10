// Fetches inspection rows from the Analyze Boston CKAN datastore (JSON over HTTPS).
const API = 'https://data.boston.gov/api/3/action/datastore_search_sql';
export const RESOURCE_ID = '4582bec6-2b4f-4f9e-bc55-cbaa73117f4c';
export const DATASET_URL = 'https://data.boston.gov/dataset/food-establishment-inspections';

const FIELDS = [
  '_id',
  'businessname',
  'licenseno',
  'descript',
  'result',
  'resultdttm',
  'violation',
  'viol_level',
  'violdesc',
  'viol_status',
  'comments',
  'address',
  'city',
  'zip',
  'location',
];
const PAGE_SIZE = 10000;

async function query(sql) {
  const url = `${API}?${new URLSearchParams({ sql })}`;
  const response = await fetch(url, {
    headers: { 'user-agent': 'BackOfHouse-seed/1.0 (CS5610 student project)' },
  });
  const body = await response.json();
  if (!body.success) throw new Error(`Boston API error: ${JSON.stringify(body.error)}`);
  return body.result.records;
}

// All rows for active, sit-down or take-out restaurants inspected since `since` (YYYY-MM-DD).
export async function fetchRows({ since, onPage }) {
  const where = `licstatus = 'Active' AND licensecat IN ('FS','FT') AND resultdttm >= '${since}'`;
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await query(
      `SELECT ${FIELDS.join(', ')} FROM "${RESOURCE_ID}" WHERE ${where} ORDER BY _id LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
    );
    rows.push(...page);
    onPage?.(rows.length);
    if (page.length < PAGE_SIZE) return rows;
  }
}
