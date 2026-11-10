import PropTypes from 'prop-types';

import './EmptyState.css';

export default function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      {children}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
