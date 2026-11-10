// Plain-English decoding of Boston inspection violations.
// Boston cites the FDA Food Code, e.g. "590.003/3-501.16-P":
//   590.003  = Massachusetts regulation chapter
//   3-501.16 = FDA Food Code section (what this table is keyed by)
//   P / PF / C = Priority / Priority foundation / Core
// These 80 sections cover about 89% of failed violations since 2023. Anything else falls back
// to the inspector's official description, cleaned up.

export const CATEGORIES = Object.freeze({
  pests: 'Pests',
  temperature: 'Food temperature',
  hygiene: 'Staff hygiene',
  contamination: 'Contamination risk',
  cleaning: 'Cleaning & sanitizing',
  plumbing: 'Water & plumbing',
  facility: 'Building & equipment',
  management: 'Management & paperwork',
  chemicals: 'Chemicals',
});

const S = (plain, category) => ({ plain, category });

export const SECTIONS = Object.freeze({
  // Pests
  '6-501.111': S('Signs of pests (mice, roaches or insects) in the kitchen', 'pests'),
  '6-501.112': S('Dead or trapped pests weren’t removed', 'pests'),
  '6-202.15': S('Doors or windows could let pests in', 'pests'),

  // Temperature
  '3-501.16': S('Food wasn’t kept hot enough or cold enough', 'temperature'),
  '3-501.17': S('Prepared food wasn’t dated, or was kept too long', 'temperature'),
  '3-501.13': S('Frozen food was thawed the wrong way', 'temperature'),
  '3-501.15': S('Cooked food wasn’t cooled down safely', 'temperature'),
  '4-301.11': S('Fridges or hot holding couldn’t keep food at a safe temperature', 'temperature'),
  '4-204.112': S('Fridge thermometers were missing or broken', 'temperature'),
  '4-302.12': S('No working food thermometer on hand', 'temperature'),
  '3-603.11': S('Menu doesn’t warn about raw or undercooked food', 'temperature'),

  // Staff hygiene
  '2-301.14': S('Staff didn’t wash their hands when they should have', 'hygiene'),
  '2-402.11': S('A cook wasn’t wearing a hair restraint', 'hygiene'),
  '5-205.11': S('The hand sink was blocked or used for something else', 'hygiene'),
  '6-301.11': S('No soap at the hand sink', 'hygiene'),
  '6-301.12': S('No paper towels or hand dryer at the hand sink', 'hygiene'),
  '6-301.14': S('Missing “wash your hands” sign', 'hygiene'),
  '3-301.11': S('Ready-to-eat food was touched with bare hands', 'hygiene'),
  '2-501.11': S('No plan or kit for cleaning up vomit or diarrhea', 'hygiene'),

  // Contamination
  '3-302.11': S('Raw and ready-to-eat food weren’t stored apart', 'contamination'),
  '3-302.12': S('Food containers weren’t labelled', 'contamination'),
  '3-305.11': S('Food was stored where it could get contaminated', 'contamination'),
  '3-305.12': S('Food was stored in a place it’s not allowed', 'contamination'),
  '3-305.14': S('Food was prepared somewhere it could get contaminated', 'contamination'),
  '3-307.11': S('Food was exposed to other sources of contamination', 'contamination'),
  '3-304.12': S('Utensils were stored in an unsanitary way between uses', 'contamination'),
  '3-304.14': S('Wiping cloths weren’t stored in sanitizer', 'contamination'),
  '3-203.12': S('Shellfish tags weren’t kept as required', 'contamination'),
  '3-602.11': S('Packaged food was missing a proper label', 'contamination'),
  '4-101.16': S('Sponges were used where they’re not allowed', 'contamination'),
  '4-903.11': S('Clean dishes or utensils were stored where they could get dirty', 'contamination'),

  // Cleaning & sanitizing
  '4-601.11': S('Surfaces or utensils that touch food weren’t clean', 'cleaning'),
  '4-602.11': S('Food-contact surfaces weren’t cleaned often enough', 'cleaning'),
  '4-602.13': S('Equipment surfaces were dirty', 'cleaning'),
  '4-302.14': S('No test strips to check sanitizer strength', 'cleaning'),
  '4-303.11': S('Cleaning or sanitizing supplies weren’t available', 'cleaning'),
  '4-501.114': S('Dishwashing sanitizer was the wrong strength or temperature', 'cleaning'),
  '4-501.112': S('The dishwasher’s hot-water rinse wasn’t hot enough', 'cleaning'),
  '4-302.13': S('No thermometer to check dishwashing temperatures', 'cleaning'),
  '6-501.12': S('The kitchen wasn’t cleaned often enough', 'cleaning'),
  '6-501.13': S('Floors were swept in a way that spreads dust', 'cleaning'),
  '6-501.14': S('Vents and hoods needed cleaning', 'cleaning'),
  '6-501.16': S('Mops weren’t hung up to dry', 'cleaning'),
  '6-501.18': S('Sinks or toilets weren’t clean', 'cleaning'),
  '6-501.114': S('Unneeded items or litter were left around the premises', 'cleaning'),

  // Water & plumbing
  '5-402.11': S('Missing protection against dirty water flowing back', 'plumbing'),
  '5-202.13': S('Missing air gap to stop dirty water backing up', 'plumbing'),
  '5-203.14': S('Missing backflow prevention device', 'plumbing'),
  '5-205.15': S('Plumbing wasn’t in good repair', 'plumbing'),
  '5-203.13': S('No mop sink for cleaning water', 'plumbing'),
  '5-402.12': S('Grease trap problem', 'plumbing'),
  '5-501.113': S('Trash bins weren’t covered', 'plumbing'),
  '5-501.115': S('Trash areas weren’t kept clean', 'plumbing'),
  '5-501.15': S('Outdoor trash containers were in poor shape', 'plumbing'),
  '5-501.17': S('Bathroom trash bin had no lid', 'plumbing'),
  '5-501.13': S('Trash containers weren’t suitable', 'plumbing'),

  // Building & equipment
  '6-201.11': S('Floors, walls or ceilings were hard to clean', 'facility'),
  '6-201.12': S('Exposed pipes or wires made floors and walls hard to clean', 'facility'),
  '6-201.16': S('Wall or ceiling coverings were damaged', 'facility'),
  '6-201.17': S('Things attached to walls or ceilings were dirty or loose', 'facility'),
  '6-101.11': S('Indoor surfaces were made of materials that are hard to clean', 'facility'),
  '6-501.11': S('The building needed repairs', 'facility'),
  '6-303.11': S('The kitchen was too dimly lit', 'facility'),
  '6-202.11': S('Light bulbs weren’t shielded over food areas', 'facility'),
  '4-501.11': S('Equipment was broken or out of adjustment', 'facility'),
  '4-501.12': S('Cutting boards were worn and hard to clean', 'facility'),
  '4-502.11': S('Utensils or thermometers were broken or uncalibrated', 'facility'),
  '4-101.11': S('Equipment was made of unsuitable materials', 'facility'),
  '4-101.19': S('Equipment surfaces weren’t smooth or easy to clean', 'facility'),
  '4-202.11': S('Food-contact surfaces were hard to clean', 'facility'),
  '4-202.16': S('Equipment surfaces had hard-to-clean spots', 'facility'),
  '4-202.18': S('Hood filters were missing or the wrong kind', 'facility'),

  // Management & paperwork
  '2-103.11': S('The person in charge wasn’t keeping food-safety rules', 'management'),
  '2-102.11': S('The person in charge couldn’t show food-safety knowledge', 'management'),
  '2-102.12': S('No certified food protection manager on staff', 'management'),
  '8-103.12': S('An approved food-safety procedure wasn’t followed', 'management'),
  '8-404.11': S('Should have stopped serving and reported a health hazard', 'management'),

  // Chemicals
  '7-102.11': S('Chemical spray bottles weren’t labelled', 'chemicals'),
  '7-204.11': S('Sanitizer chemicals weren’t used correctly', 'chemicals'),
});

const LEVELS = Object.freeze({ '*': 'Minor', '**': 'Moderate', '***': 'Serious' });

// "590.003/3-501.16-P" -> "3-501.16"
export function sectionOf(code) {
  const match = /(\d+-\d+\.\d+)/.exec(code ?? '');
  return match ? match[1] : null;
}

function fallbackCategory(section) {
  const chapter = section?.[0];
  if (section?.startsWith('3-5')) return 'temperature';
  return (
    {
      2: 'hygiene',
      3: 'contamination',
      4: 'facility',
      5: 'plumbing',
      6: 'facility',
      7: 'chemicals',
      8: 'management',
    }[chapter] ?? 'management'
  );
}

// "(A)(2) and (B) Time/Temperature Control ... (P)" -> "Time/Temperature Control ..."
function cleanDescription(text) {
  return (text ?? '')
    .replace(/\((?:P|Pf|PF|C)\)\s*$/, '')
    .replace(/^\s*(?:\([A-Z0-9 ]+\)[\s,-]*(?:and|-)?\s*)+/, '')
    .replace(/\s{2,}/g, ', ')
    .trim();
}

export function levelOf(starLevel) {
  return LEVELS[starLevel] ?? null;
}

export function decodeViolation(code, officialDescription) {
  const section = sectionOf(code);
  const known = section && SECTIONS[section];
  if (known) return { section, ...known };
  return {
    section,
    plain: cleanDescription(officialDescription) || 'Other violation',
    category: fallbackCategory(section),
  };
}
