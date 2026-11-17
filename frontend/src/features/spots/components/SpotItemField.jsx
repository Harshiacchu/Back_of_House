import PropTypes from 'prop-types';

import { draftItemShape } from '../spotShapes.js';
import './SpotItemField.css';

// One restaurant inside the list form: its name, an editable note and a remove button.
export default function SpotItemField({ item, onNoteChange, onRemove }) {
  const { restaurant } = item;
  return (
    <div className="spot-item-field">
      <div className="spot-item-field__top">
        <span className="spot-item-field__name">{restaurant.name}</span>
        <button
          type="button"
          className="btn btn--ghost btn--small"
          aria-label={`Remove ${restaurant.name}`}
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
      <label className="field">
        <span className="visually-hidden">Note for {restaurant.name}</span>
        <input
          maxLength={300}
          placeholder="Add a note, e.g. “Ask for the patio”"
          value={item.note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </label>
    </div>
  );
}

SpotItemField.propTypes = {
  item: draftItemShape.isRequired,
  onNoteChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
