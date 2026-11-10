import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { createVisit, deleteVisit, listVisits, updateVisit } from '../../../api/visits.js';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import LoadingState from '../../../components/LoadingState.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import { useFetch } from '../../../hooks/useFetch.js';
import VisitForm from '../components/VisitForm.jsx';
import VisitItem from '../components/VisitItem.jsx';
import './VisitLogPage.css';

export default function VisitLogPage() {
  useDocumentTitle('Visit Log');
  const [params, setParams] = useSearchParams();
  const fromReport = params.get('restaurant')
    ? { _id: params.get('restaurant'), name: params.get('name') || 'Selected restaurant' }
    : null;

  const { data, error, loading, reload } = useFetch(listVisits);
  // null = closed, 'new' = creating, otherwise the visit being edited
  const [editing, setEditing] = useState(fromReport ? 'new' : null);
  const [actionError, setActionError] = useState(null);

  function closeForm() {
    setEditing(null);
    if (fromReport) setParams({}, { replace: true });
  }

  async function handleSubmit(body) {
    if (editing === 'new') await createVisit(body);
    else await updateVisit(editing._id, body);
    closeForm();
    reload();
  }

  async function handleDelete(id) {
    setActionError(null);
    try {
      await deleteVisit(id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  const visits = data?.items ?? [];

  return (
    <section>
      <PageHeader
        title="Visit Log"
        lead="Every meal, pinned to what the kitchen’s inspection record looked like that day."
        actions={
          editing === null && (
            <button type="button" className="btn btn--primary" onClick={() => setEditing('new')}>
              + Log a visit
            </button>
          )
        }
      />

      {editing !== null && (
        <VisitForm
          key={editing === 'new' ? 'new' : editing._id}
          visit={editing === 'new' ? undefined : editing}
          initialRestaurant={fromReport ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {actionError && <ErrorMessage message={actionError} />}
      {error && <ErrorMessage message={error.message} onRetry={reload} />}
      {!error && loading && !data && <LoadingState label="Loading your visits…" />}
      {!error && data && visits.length === 0 && (
        <EmptyState title="No visits yet">
          <p>Log your first visit and we’ll show how the kitchen was doing that day.</p>
        </EmptyState>
      )}
      {visits.length > 0 && (
        <ul className="visit-log__list">
          {visits.map((visit) => (
            <li key={visit._id}>
              <VisitItem
                visit={visit}
                onEdit={() => setEditing(visit)}
                onDelete={() => handleDelete(visit._id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
