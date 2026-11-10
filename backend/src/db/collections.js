// Single source of truth for collection names, so features never hard-code strings
// for collections they do not own (e.g. polls looking up restaurants).
export const COLLECTIONS = Object.freeze({
  users: 'users',
  sessions: 'sessions',
  restaurants: 'restaurants',
  inspections: 'inspections',
  visits: 'visits',
  polls: 'polls',
  spots: 'spots',
});
