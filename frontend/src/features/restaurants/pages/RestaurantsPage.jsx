import { useCallback, useState } from 'react';

import { getNeighborhoods, searchRestaurants } from '../../../api/restaurants.js';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import LoadingState from '../../../components/LoadingState.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import Pagination from '../../../components/Pagination.jsx';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import { useFetch } from '../../../hooks/useFetch.js';
import RestaurantCard from '../components/RestaurantCard.jsx';
import RestaurantFilters from '../components/RestaurantFilters.jsx';
import './RestaurantsPage.css';

const PAGE_SIZE = 12;

export default function RestaurantsPage() {
  useDocumentTitle('Kitchen Reports');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ neighborhood: '', trajectory: '', page: 1 });
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  const { data: hoods } = useFetch(getNeighborhoods);
  const loader = useCallback(
    (signal) =>
      searchRestaurants(
        {
          q: debouncedQuery,
          neighborhood: filters.neighborhood,
          trajectory: filters.trajectory,
          page: filters.page,
          limit: PAGE_SIZE,
        },
        signal,
      ),
    [debouncedQuery, filters],
  );
  const { data, error, loading, reload } = useFetch(loader);

  function handleFilterChange(patch) {
    if ('query' in patch) {
      setQuery(patch.query);
      setFilters((f) => ({ ...f, page: 1 }));
      return;
    }
    setFilters((f) => ({ ...f, ...patch, page: 1 }));
  }

  const items = data?.items ?? [];

  return (
    <section>
      <PageHeader
        title="Kitchen Reports"
        lead="Every Boston restaurant inspection, decoded. Search for a place, then open its full report."
      />

      <RestaurantFilters
        query={query}
        neighborhood={filters.neighborhood}
        trajectory={filters.trajectory}
        neighborhoods={hoods?.neighborhoods ?? []}
        onChange={handleFilterChange}
      />

      {error && <ErrorMessage message={error.message} onRetry={reload} />}
      {!error && loading && !data && <LoadingState label="Loading restaurants…" />}
      {!error && data && (
        <>
          <p className="restaurants-page__count" aria-live="polite">
            {data.total.toLocaleString()} restaurant{data.total === 1 ? '' : 's'}
          </p>
          {items.length === 0 ? (
            <EmptyState title="No restaurants found">
              <p>Try a shorter name or clear the filters.</p>
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
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </>
      )}
    </section>
  );
}

RestaurantsPage.propTypes = {};
