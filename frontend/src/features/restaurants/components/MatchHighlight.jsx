import PropTypes from 'prop-types';

const plain = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

// Marks the words of `text` that start with one of the words the user typed.
export default function MatchHighlight({ text, query }) {
  const typed = query.split(/\s+/).map(plain).filter(Boolean);
  return text.split(/(\s+)/).map((part, i) => {
    const word = plain(part);
    const hit = word && typed.some((t) => word.startsWith(t));
    // Parts are positional slices of one string that never reorders.
    // eslint-disable-next-line react/no-array-index-key
    return hit ? <mark key={i}>{part}</mark> : part;
  });
}

MatchHighlight.propTypes = {
  text: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
};
