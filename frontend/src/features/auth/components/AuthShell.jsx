import PropTypes from 'prop-types';

import kitchenPass from '../../../assets/photos/kitchen-pass.webp';
import './AuthShell.css';

// Split screen: photo + promise on the left, the form on the right.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <aside className="auth-shell__visual" style={{ '--auth-photo': `url(${kitchenPass})` }}>
        <p className="auth-shell__quote">
          Know what’s behind the door <span>before you sit down.</span>
        </p>
      </aside>
      <section className="auth-shell__panel" aria-labelledby="auth-title">
        <div className="auth-shell__content">
          <h1 id="auth-title" className="auth-shell__title">
            {title}
          </h1>
          {subtitle && <p className="auth-shell__subtitle">{subtitle}</p>}
          {children}
          {footer && <p className="auth-shell__footer">{footer}</p>}
        </div>
      </section>
    </div>
  );
}

AuthShell.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
};
