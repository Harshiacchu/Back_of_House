import PropTypes from 'prop-types';

import './RatingInput.css';

const VALUES = [1, 2, 3, 4, 5];

// Five radio buttons drawn as stars; keyboard arrows work natively.
export default function RatingInput({ name, value, onChange }) {
  return (
    <fieldset className="rating-input">
      <legend>Rating</legend>
      <div className="rating-input__stars">
        {VALUES.map((n) => (
          <label key={n} className={n <= value ? 'rating-input__star is-on' : 'rating-input__star'}>
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="visually-hidden"
            />
            <span aria-hidden="true">★</span>
            <span className="visually-hidden">
              {n} star{n === 1 ? '' : 's'}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

RatingInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
