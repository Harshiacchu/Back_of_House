import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Back of House` : 'Back of House';
  }, [title]);
}
