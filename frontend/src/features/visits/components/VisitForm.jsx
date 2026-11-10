import PropTypes from 'prop-types';
import { useState } from 'react';

import RatingInput from './RatingInput.jsx';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import { toDateInputValue } from '../../../utils/format.js';
import { visitShape } from '../../../utils/propShapes.js';
import RestaurantPicker from '../../restaurants/components/RestaurantPicker.jsx';
import './VisitForm.css';

const today = () => new Date().toISOString().slice(0, 10);

function initialState(visit, restaurant) {
  return {
    restaurant: visit?.restaurant ?? restaurant ?? null,
    visitDate: visit ? toDateInputValue(visit.visitDate) : today(),
    dish: visit?.dish ?? '',
    rating: visit?.rating ?? 4,
    notes: visit?.notes ?? '',
  };
}

// Create or edit a visit. onSubmit receives the API body; onCancel closes the form.
export default function VisitForm({ visit, initialRestaurant, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => initialState(visit, initialRestaurant));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.restaurant) {
      setError('Pick the restaurant you visited.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        restaurantId: form.restaurant._id,
        visitDate: form.visitDate,
        dish: form.dish.trim(),
        rating: form.rating,
        notes: form.notes.trim(),
      });
    } catch (err) {
      setError(err.details ? Object.values(err.details).join('. ') : err.message);
      setSaving(false);
    }
  }

  return (
    <form className="visit-form" onSubmit={handleSubmit}>
      <h2 className="visit-form__title">{visit ? 'Edit visit' : 'Log a visit'}</h2>
      {error && <ErrorMessage message={error} />}

      <RestaurantPicker value={form.restaurant} onChange={set('restaurant')} />

      <div className="visit-form__row">
        <label className="field">
          Date
          <input
            type="date"
            required
            max={today()}
            value={form.visitDate}
            onChange={(e) => set('visitDate')(e.target.value)}
          />
        </label>
        <label className="field">
          What you ate
          <input
            maxLength={120}
            placeholder="e.g. Spicy dan dan noodles"
            value={form.dish}
            onChange={(e) => set('dish')(e.target.value)}
          />
        </label>
      </div>

      <RatingInput name="rating" value={form.rating} onChange={set('rating')} />

      <label className="field">
        Notes
        <textarea
          maxLength={1000}
          placeholder="Anything worth remembering?"
          value={form.notes}
          onChange={(e) => set('notes')(e.target.value)}
        />
      </label>

      <div className="visit-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save visit'}
        </button>
      </div>
    </form>
  );
}

VisitForm.propTypes = {
  visit: visitShape,
  initialRestaurant: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
