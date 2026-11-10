import { useCallback, useEffect, useMemo, useState } from 'react';

// Runs `loader(signal)` whenever it changes (wrap it in useCallback) and exposes
// { data, error, loading, reload }. Previous data stays visible while reloading.
export function useFetch(loader) {
  const [reloadCount, setReloadCount] = useState(0);
  const request = useMemo(() => ({ loader, reloadCount }), [loader, reloadCount]);
  const [result, setResult] = useState({ request: null, data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();
    request.loader(controller.signal).then(
      (data) => setResult({ request, data, error: null }),
      (error) => {
        if (!controller.signal.aborted) setResult({ request, data: null, error });
      },
    );
    return () => controller.abort();
  }, [request]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);
  const loading = result.request !== request;

  return { data: result.data, error: loading ? null : result.error, loading, reload };
}
