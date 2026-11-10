import { Link } from 'react-router-dom';

import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import './NotFoundPage.css';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');

  return (
    <section className="not-found">
      <h1 className="not-found__title">This page isn’t on the menu.</h1>
      <p className="not-found__lead">The link may be broken, or the page may have moved.</p>
      <Link to="/" className="link-more">
        Back to Back of House
      </Link>
    </section>
  );
}
