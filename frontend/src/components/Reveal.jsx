import PropTypes from 'prop-types';

import { useInView } from '../hooks/useInView.js';
import './Reveal.css';

// Fades its children up into place the first time they scroll into view.
export default function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'reveal--in' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

Reveal.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
  className: PropTypes.string,
};
