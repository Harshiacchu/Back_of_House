import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getNeighborhoods, searchRestaurants } from '../../../api/restaurants.js';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import Pagination from '../../../components/Pagination.jsx';
import { useCursorPagination } from '../../../hooks/useCursorPagination.js';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { TRAJECTORIES } from '../../../utils/propShapes.js';
import RestaurantCard from '../components/RestaurantCard.jsx';
import RestaurantCardSkeleton from '../components/RestaurantCardSkeleton.jsx';
import CardGuide from '../components/CardGuide.jsx';
import KitchenWeather from '../components/KitchenWeather.jsx';
import RestaurantFilters from '../components/RestaurantFilters.jsx';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES, SORT_OPTIONS } from '../searchOptions.js';
import './RestaurantsPage.css';

const MAX_SKELETONS = 6;

// Filters live in the URL, so Back from a report returns to the same search.
function readFilters(params) {
  const trajectory = params.get('trajectory') ?? '';
  const sort = params.get('sort') ?? '';
  const size = Number(params.get('size'));
  return {
    neighborhood: params.get('neighborhood') ?? '',
    trajectory: TRAJECTORIES.includes(trajectory) ? trajectory : '',
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : 'recent',
    size: PAGE_SIZES.includes(size) ? size : DEFAULT_PAGE_SIZE,
  };
}

export default function RestaurantsPage() {
  useDocumentTitle('Kitchen Reports');
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);
  const [query, setQuery] = useState(() => params.get('q') ?? '');
  const q = useDebouncedValue(query.trim(), 300);
  const resultsRef = useRef(null);

  const updateParams = useCallback(
    (patch) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([key, value]) =>
            value ? next.set(key, value) : next.delete(key),
          );
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );
  useEffect(() => {
    updateParams({ q });
  }, [q, updateParams]);

  const searchKey = JSON.stringify({ q, ...filters });
  const pages = useCursorPagination(searchKey);

  const { data: hoods } = useFetch(getNeighborhoods);
  const loader = useCallback(
    (signal) =>
      searchRestaurants(
        {
          q,
          neighborhood: filters.neighborhood,
          trajectory: filters.trajectory,
          sort: filters.sort,
          limit: filters.size,
          cursor: pages.cursor,
        },
        signal,
      ),
    [q, filters, pages.cursor],
  );
  const { data, error, loading, reload } = useFetch(loader);

  const items = data?.items ?? [];
  const total = data?.total ?? pages.knownTotal;
  const from = pages.pageIndex * filters.size + 1;

  function pickNeighborhood(name) {
    updateParams({ neighborhood: name === filters.neighborhood ? '' : name });
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function goTo(move) {
    move();
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section>
      <PageHeader
        title="Kitchen Reports"
        lead="Every Boston restaurant inspection, decoded. Search for a place, then open its full report."
      />

      <KitchenWeather neighborhood={filters.neighborhood} onPickNeighborhood={pickNeighborhood} />

      <RestaurantFilters
        query={query}
        onQueryChange={setQuery}
        {...filters}
        neighborhoods={hoods?.neighborhoods ?? []}
        onChange={updateParams}
      />

      <CardGuide />

      <div ref={resultsRef} className="restaurants-page__results">
        {error && <ErrorMessage message={error.message} onRetry={reload} />}

        {!error && !data && (
          <ul className="restaurants-page__grid" aria-busy="true">
            <li className="visually-hidden">Loading restaurants…</li>
            {Array.from({ length: Math.min(filters.size, MAX_SKELETONS) }, (_, i) => (
              <li key={i} aria-hidden="true">
                <RestaurantCardSkeleton />
              </li>
            ))}
          </ul>
        )}

        {!error && data && (
          <>
            {total != null && (
              <p className="restaurants-page__count" aria-live="polite">
                {total.toLocaleString()} restaurant{total === 1 ? '' : 's'}
                {q && ` matching “${q}”`}
              </p>
            )}
            {items.length === 0 ? (
              <EmptyState title="No restaurants found">
                <p>Try fewer letters, another neighborhood, or clear the trajectory filter.</p>
              </EmptyState>
            ) : (
              <ul className="restaurants-page__grid" aria-busy={loading}>
                {items.map((restaurant) => (
                  <li key={restaurant._id}>
                    <RestaurantCard restaurant={restaurant} />
                  </li>
                ))}
              </ul>
            )}
            <Pagination
              from={from}
              to={from + items.length - 1}
              total={total}
              hasPrevious={pages.pageIndex > 0}
              hasNext={Boolean(data.nextCursor)}
              onPrevious={() => goTo(pages.previous)}
              onNext={() => goTo(() => pages.next(data.nextCursor, total))}
            />
          </>
        )}
      </div>
    </section>
  );
}
