import { useState } from 'react';

import { createPoll, deletePoll, listPolls, updatePoll } from '../../../api/polls.js';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import LoadingState from '../../../components/LoadingState.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import { useFetch } from '../../../hooks/useFetch.js';
import PollCard from '../components/PollCard.jsx';
import PollForm from '../components/PollForm.jsx';
import './PollsPage.css';

export default function PollsPage() {
  useDocumentTitle('Group Picks');
  const { data, error, loading, reload } = useFetch(listPolls);
  // null = closed, 'new' = creating, otherwise the poll being edited
  const [editing, setEditing] = useState(null);
  const [actionError, setActionError] = useState(null);

  async function handleSubmit(body) {
    if (editing === 'new') await createPoll(body);
    else await updatePoll(editing._id, body);
    setEditing(null);
    reload();
  }

  async function handleDelete(id) {
    setActionError(null);
    try {
      await deletePoll(id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  const polls = data?.items ?? [];

  return (
    <section>
      <PageHeader
        title="Group Picks"
        lead="Where are we eating? Put a few places to a vote and compare their kitchens side by side."
        actions={
          editing === null && (
            <button type="button" className="btn btn--primary" onClick={() => setEditing('new')}>
              + New poll
            </button>
          )
        }
      />

      {editing !== null && (
        <PollForm
          key={editing === 'new' ? 'new' : editing._id}
          poll={editing === 'new' ? undefined : editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}

      {actionError && <ErrorMessage message={actionError} />}
      {error && <ErrorMessage message={error.message} onRetry={reload} />}
      {!error && loading && !data && <LoadingState label="Loading your polls…" />}
      {!error && data && polls.length === 0 && (
        <EmptyState title="No polls yet">
          <p>
            Start a poll with two to five restaurants, then share the link with your group. Polls
            your friends share with you show up here once you vote.
          </p>
        </EmptyState>
      )}
      {polls.length > 0 && (
        <ul className="polls-page__list">
          {polls.map((poll) => (
            <li key={poll._id}>
              <PollCard
                poll={poll}
                onEdit={() => setEditing(poll)}
                onDelete={() => handleDelete(poll._id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
