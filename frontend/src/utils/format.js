const DATE = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : DATE.format(date);
}

// yyyy-mm-dd for <input type="date">.
export function toDateInputValue(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}
