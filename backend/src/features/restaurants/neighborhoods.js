// The dataset's `city` is a neighborhood for most restaurants, but plain "BOSTON" for the
// central ones; those are mapped from their ZIP code.
const BOSTON_ZIPS = Object.freeze({
  '02108': 'Beacon Hill',
  '02109': 'Downtown',
  '02110': 'Financial District',
  '02111': 'Chinatown',
  '02113': 'North End',
  '02114': 'West End',
  '02115': 'Fenway',
  '02116': 'Back Bay',
  '02118': 'South End',
  '02119': 'Roxbury',
  '02120': 'Mission Hill',
  '02121': 'Dorchester',
  '02122': 'Dorchester',
  '02124': 'Dorchester',
  '02125': 'Dorchester',
  '02126': 'Mattapan',
  '02127': 'South Boston',
  '02128': 'East Boston',
  '02129': 'Charlestown',
  '02130': 'Jamaica Plain',
  '02131': 'Roslindale',
  '02132': 'West Roxbury',
  '02134': 'Allston',
  '02135': 'Brighton',
  '02136': 'Hyde Park',
  '02163': 'Allston',
  '02199': 'Back Bay',
  '02201': 'Downtown',
  '02203': 'Downtown',
  '02210': 'Seaport',
  '02215': 'Fenway',
  '02222': 'West End',
  '02467': 'Chestnut Hill',
});

const titleCase = (text) => text.toLowerCase().replace(/\b([a-z])/g, (c) => c.toUpperCase());

export function neighborhoodOf(city, zip) {
  const cleanCity = (city ?? '').replace(/\/+$/, '').trim().toUpperCase();
  const zip5 = (zip ?? '').trim().slice(0, 5).padStart(5, '0');
  if (!cleanCity || cleanCity === 'BOSTON') return BOSTON_ZIPS[zip5] ?? 'Boston';
  if (cleanCity.includes('FINANCIAL')) return 'Financial District';
  return titleCase(cleanCity);
}

export { titleCase };
