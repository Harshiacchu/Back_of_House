import { useCallback, useState } from 'react';

const FIRST_PAGE = { stack: [], total: null };

// Client side of keyset pagination. Keeps the cursors of the pages already visited so Previous
// needs no extra API, and the total from page 1 so later pages can skip the count query.
// Changing `resetKey` (e.g. the filters) starts again at page 1.
export function useCursorPagination(resetKey) {
  const [state, setState] = useState({ key: resetKey, ...FIRST_PAGE });
  const current = state.key === resetKey ? state : FIRST_PAGE;

  const next = useCallback(
    (cursor, total) =>
      setState((s) => {
        const base = s.key === resetKey ? s : FIRST_PAGE;
        return { key: resetKey, stack: [...base.stack, cursor], total: base.total ?? total };
      }),
    [resetKey],
  );

  const previous = useCallback(
    () =>
      setState((s) => {
        const base = s.key === resetKey ? s : FIRST_PAGE;
        return { ...base, key: resetKey, stack: base.stack.slice(0, -1) };
      }),
    [resetKey],
  );

  return {
    cursor: current.stack.at(-1) ?? null,
    pageIndex: current.stack.length,
    knownTotal: current.total,
    next,
    previous,
  };
}
