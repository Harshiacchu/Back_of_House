import { useState } from 'react';

import {
  createSpotList,
  deleteSpotList,
  listSpotLists,
  updateSpotList,
} from '../../../api/spots.js';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import LoadingState from '../../../components/LoadingState.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import { useFetch } from '../../../hooks/useFetch.js';
import SpotListCard from '../components/SpotListCard.jsx';
import SpotListForm from '../components/SpotListForm.jsx';
import './SpotsPage.css';

export default function SpotsPage() {
  useDocumentTitle('My Spots');
  const { data, error, loading, reload } = useFetch(listSpotLists);
  // null = closed, 'new' = creating, otherwise the list being edited
  const [editing, setEditing] = useState(null);
  const [actionError, setActionError] = useState(null);

  async function handleSubmit(body) {
    if (editing === 'new') await createSpotList(body);
    else await updateSpotList(editing._id, body);
    setEditing(null);
    reload();
  }

  async function handleDelete(id) {
    setActionError(null);
    try {
      await deleteSpotList(id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  const lists = data?.items ?? [];

  return (
    <section className="spots-page">
      <PageHeader
        title="My Spots"
        lead="Your own lists of places you love or want to try, with today’s kitchen score next to each one."
        actions={
          editing === null && (
            <button type="button" className="btn btn--primary" onClick={() => setEditing('new')}>
              + New list
            </button>
          )
        }
      />

      {editing !== null && (
        <SpotListForm
          key={editing === 'new' ? 'new' : editing._id}
          list={editing === 'new' ? undefined : editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}

      {actionError && <ErrorMessage message={actionError} />}
      {error && <ErrorMessage message={error.message} onRetry={reload} />}
      {!error && loading && !data && <LoadingState label="Loading your lists…" />}
      {!error && data && lists.length === 0 && (
        <EmptyState title="No lists yet">
          <p>Make a list like “Date night” or “Want to try” and add restaurants with notes.</p>
        </EmptyState>
      )}
      {lists.map((list) => (
        <SpotListCard
          key={list._id}
          list={list}
          onEdit={() => setEditing(list)}
          onDelete={() => handleDelete(list._id)}
        />
      ))}
    </section>
  );
}
