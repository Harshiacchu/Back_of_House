import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { castVote, getPoll } from '../../../api/polls.js';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import LoadingState from '../../../components/LoadingState.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import { useFetch } from '../../../hooks/useFetch.js';
import PollComparison from '../components/PollComparison.jsx';
import ShareLinkButton from '../components/ShareLinkButton.jsx';
import './PollDetailPage.css';

export default function PollDetailPage() {
  const { id } = useParams();
  const loader = useCallback((signal) => getPoll(id, signal), [id]);
  const { data, error, loading, reload } = useFetch(loader);
  // The vote response carries the fresh tallies; keep it until the poll is reloaded.
  const [afterVote, setAfterVote] = useState(null);
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState(null);

  const detail = afterVote?.poll._id === id ? afterVote : data;
  useDocumentTitle(detail?.poll.title ?? 'Group Pick');

  async function handleVote(restaurantId) {
    setVoting(true);
    setVoteError(null);
    try {
      setAfterVote(await castVote(id, restaurantId));
    } catch (err) {
      setVoteError(err.message);
    } finally {
      setVoting(false);
    }
  }

  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;
  if (loading && !detail) return <LoadingState label="Loading poll…" />;
  if (!detail) return null;

  const { poll, candidates, myVote } = detail;
  const asker = poll.isCreator ? 'You' : poll.creatorName;
  const lead = myVote
    ? 'Your vote is in. You can switch it any time before the group decides.'
    : 'Compare the kitchens, then pick where you’d like to eat.';

  return (
    <section className="poll-detail">
      <Link to="/polls" className="poll-detail__back">
        ‹ Group Picks
      </Link>

      <PageHeader
        eyebrow={`${asker} asked · ${poll.totalVotes} ${poll.totalVotes === 1 ? 'vote' : 'votes'}`}
        title={poll.title}
        lead={lead}
        actions={<ShareLinkButton />}
      />

      {voteError && <ErrorMessage message={voteError} />}
      <PollComparison
        candidates={candidates}
        totalVotes={poll.totalVotes}
        myVote={myVote}
        voting={voting}
        onVote={handleVote}
      />
      <p className="poll-detail__note">
        Severity is the worst of each kitchen’s last three inspections, from 0 (clean) to 100. Open
        a restaurant to read its full kitchen report.
      </p>
    </section>
  );
}

PollDetailPage.propTypes = {};
