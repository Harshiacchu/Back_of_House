import { Outlet, useLocation } from 'react-router-dom';

import NavBar from './NavBar.jsx';
import './Layout.css';

// Pages that draw edge to edge (no centred content column).
const FULL_BLEED = new Set(['/', '/login', '/register', '/verify']);

export default function Layout() {
  const { pathname } = useLocation();
  const fullBleed = FULL_BLEED.has(pathname);

  return (
    <div className={fullBleed ? 'layout' : 'layout layout--app'}>
      <a className="layout__skip" href="#main">
        Skip to content
      </a>
      <NavBar />
      <main id="main" className={fullBleed ? 'layout__main--bleed' : 'layout__main'}>
        <Outlet />
      </main>
      <footer className="layout__footer">
        <div className="layout__footer-inner">
          <p>
            Inspection data from the City of Boston Food Establishment Inspections dataset,
            published on Analyze Boston. Scores and trajectories are calculated by Back of House.
          </p>
          <p>Back of House · CS5610 Web Development · Northeastern University</p>
        </div>
      </footer>
    </div>
  );
}
