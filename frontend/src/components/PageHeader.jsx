import PropTypes from 'prop-types';

import './PageHeader.css';

// Large title + optional eyebrow, lead and actions, used at the top of every app page.
export default function PageHeader({ eyebrow, title, lead, actions }) {
  return (
    <header className="page-header">
      <div className="page-header__text">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
        {lead && <p className="page-header__lead">{lead}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

PageHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  lead: PropTypes.string,
  actions: PropTypes.node,
};
