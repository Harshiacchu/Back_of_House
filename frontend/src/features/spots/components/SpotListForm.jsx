import PropTypes from 'prop-types';
import { useState } from 'react';

import SpotItemField from './SpotItemField.jsx';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import RestaurantPicker from '../../restaurants/components/RestaurantPicker.jsx';
import { spotListShape } from '../spotShapes.js';
import './SpotListForm.css';

const MAX_ITEMS = 50;

function initialItems(list) {
  return (list?.items ?? []).map((item) => ({
    restaurant: { _id: item.restaurant._id, name: item.restaurant.name },
    note: item.note ?? '',
  }));
}

// Create or edit a list. onSubmit receives the API body; onCancel closes the form.
export default function SpotListForm({ list, onSubmit, onCancel }) {
  const [name, setName] = useState(list?.name ?? '');
  const [description, setDescription] = useState(list?.description ?? '');
  const [items, setItems] = useState(() => initialItems(list));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const submitLabel = list ? 'Save changes' : 'Create list';

  function addRestaurant(restaurant) {
    if (!restaurant || items.some((item) => item.restaurant._id === restaurant._id)) return;
    setItems((current) => [...current, { restaurant, note: '' }]);
  }

  function setNote(id, note) {
    setItems((current) =>
      current.map((item) => (item.restaurant._id === id ? { ...item, note } : item)),
    );
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.restaurant._id !== id));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        items: items.map((item) => ({ restaurantId: item.restaurant._id, note: item.note.trim() })),
      });
    } catch (err) {
      setError(err.details ? Object.values(err.details).join('. ') : err.message);
      setSaving(false);
    }
  }

  return (
    <form className="spot-list-form" onSubmit={handleSubmit}>
      <h2 className="spot-list-form__title">{list ? 'Edit list' : 'New list'}</h2>
      {error && <ErrorMessage message={error} />}

      <div className="spot-list-form__row">
        <label className="field">
          Name
          <input
            required
            maxLength={60}
            placeholder="e.g. Date night, Want to try"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="field">
          Description
          <input
            maxLength={300}
            placeholder="Optional"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>

      <div className="spot-list-form__items">
        <p className="spot-list-form__label">
          Restaurants <span className="spot-list-form__count">{items.length}</span>
        </p>
        {items.length === 0 && (
          <p className="spot-list-form__hint">Empty for now. Add restaurants below or later.</p>
        )}
        {items.map((item) => (
          <SpotItemField
            key={item.restaurant._id}
            item={item}
            onNoteChange={(note) => setNote(item.restaurant._id, note)}
            onRemove={() => removeItem(item.restaurant._id)}
          />
        ))}
      </div>

      {items.length < MAX_ITEMS && (
        // Remounting after each pick clears the search box for the next one.
        <RestaurantPicker
          key={items.length}
          label="Add a restaurant"
          value={null}
          onChange={addRestaurant}
        />
      )}

      <div className="spot-list-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

SpotListForm.propTypes = {
  list: spotListShape,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
