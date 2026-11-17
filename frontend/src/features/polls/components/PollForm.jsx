import PropTypes from 'prop-types';
import { useState } from 'react';

import CandidateList from './CandidateList.jsx';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import RestaurantPicker from '../../restaurants/components/RestaurantPicker.jsx';
import { pollShape } from '../pollShapes.js';
import './PollForm.css';

const MIN_CANDIDATES = 2;
const MAX_CANDIDATES = 5;

// Create or edit a poll. onSubmit receives the API body; onCancel closes the form.
export default function PollForm({ poll, onSubmit, onCancel }) {
  const [title, setTitle] = useState(poll?.title ?? '');
  const [restaurants, setRestaurants] = useState(poll?.restaurants ?? []);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const isFull = restaurants.length >= MAX_CANDIDATES;
  const submitLabel = poll ? 'Save changes' : 'Create poll';

  function addRestaurant(restaurant) {
    if (!restaurant || restaurants.some((r) => r._id === restaurant._id)) return;
    setRestaurants((list) => [...list, restaurant]);
  }

  function removeRestaurant(id) {
    setRestaurants((list) => list.filter((r) => r._id !== id));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (restaurants.length < MIN_CANDIDATES) {
      setError(`Pick at least ${MIN_CANDIDATES} restaurants to choose between.`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ title: title.trim(), restaurantIds: restaurants.map((r) => r._id) });
    } catch (err) {
      setError(err.details ? Object.values(err.details).join('. ') : err.message);
      setSaving(false);
    }
  }

  return (
    <form className="poll-form" onSubmit={handleSubmit}>
      <h2 className="poll-form__title">{poll ? 'Edit poll' : 'New poll'}</h2>
      {error && <ErrorMessage message={error} />}

      <label className="field">
        Question
        <input
          required
          maxLength={80}
          placeholder="e.g. Friday dinner after the game?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <div className="poll-form__candidates">
        <p className="poll-form__label">
          Restaurants{' '}
          <span className="poll-form__count">
            {restaurants.length} of {MAX_CANDIDATES}
          </span>
        </p>
        <CandidateList restaurants={restaurants} onRemove={removeRestaurant} />
        {poll && poll.totalVotes > 0 && (
          <p className="poll-form__note">
            Removing a restaurant also removes the votes already cast for it.
          </p>
        )}
      </div>

      {isFull ? (
        <p className="poll-form__note">That’s the maximum. Remove one to add another.</p>
      ) : (
        // Remounting after each pick clears the search box for the next one.
        <RestaurantPicker
          key={restaurants.length}
          label="Add a restaurant"
          value={null}
          onChange={addRestaurant}
        />
      )}

      <div className="poll-form__actions">
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

PollForm.propTypes = {
  poll: pollShape,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
