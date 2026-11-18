import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  createVisit,
  deleteVisit,
  getVisitRecap,
  listVisits,
  updateVisit,
} from '../../../api/visits.js';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import ShareButton from '../../../components/ShareButton.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { drawRecapCard } from '../../../utils/shareCards.js';
import QuadrantFilter from '../components/QuadrantFilter.jsx';
import TasteMap from '../components/TasteMap.jsx';
import VisitForm from '../components/VisitForm.jsx';
import VisitItem from '../components/VisitItem.jsx';
import VisitItemSkeleton from '../components/VisitItemSkeleton.jsx';
import VisitStats from '../components/VisitStats.jsx';
import { QUADRANTS, quadrantOf } from '../tasteQuadrants.js';
import './VisitLogPage.css';

const SKELETONS = 3;
const monthFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

// Visits arrive newest first; keep that order and start a new group at each month.
function groupByMonth(visits) {
  const groups = [];
  for (const visit of visits) {
    const label = monthFormat.format(new Date(visit.visitDate));
    if (groups.at(-1)?.label !== label) groups.push({ label, visits: [] });
    groups.at(-1).visits.push(visit);
  }
  return groups;
}

// The recap is fetched only when someone asks to share it.
async function makeRecapImage() {
  const year = new Date().getFullYear();
  const { recap } = await getVisitRecap(year);
  if (recap.meals === 0) throw new Error(`Log a visit from ${year} first.`);
  return {
    blob: await drawRecapCard(recap),
    fileName: `my-${year}-in-kitchens.png`,
    title: `My ${year} in kitchens`,
  };
}

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
  const [quadrant, setQuadrant] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

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

  // Picking a dot shows its quadrant and brings its card into view.
  function handleSelect(visit) {
    setSelectedId(visit._id);
    setQuadrant(quadrantOf(visit));
    requestAnimationFrame(() =>
      document
        .getElementById(`visit-${visit._id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    );
  }

  const visits = data?.items ?? [];
  const shown = quadrant === 'all' ? visits : visits.filter((v) => quadrantOf(v) === quadrant);
  const filterOptions = [
    { key: 'all', label: 'All visits', count: visits.length },
    ...QUADRANTS.map((q) => ({
      ...q,
      count: visits.filter((v) => quadrantOf(v) === q.key).length,
    })),
  ];

  return (
    <section>
      <PageHeader
        title="Visit Log"
        lead="Every meal, pinned to what the kitchen’s inspection record looked like that day."
        actions={
          editing === null && (
            <>
              {visits.length > 0 && (
                <ShareButton
                  label={`Share my ${new Date().getFullYear()}`}
                  makeImage={makeRecapImage}
                />
              )}
              <button type="button" className="btn btn--primary" onClick={() => setEditing('new')}>
                + Log a visit
              </button>
            </>
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
      {!error && loading && !data && (
        <ul className="visit-log__list" aria-busy="true">
          <li className="visually-hidden">Loading your visits…</li>
          {Array.from({ length: SKELETONS }, (_, i) => (
            <li key={i} aria-hidden="true">
              <VisitItemSkeleton />
            </li>
          ))}
        </ul>
      )}
      {!error && data && visits.length === 0 && (
        <EmptyState title="No visits yet">
          <p>Log your first visit and we’ll show how the kitchen was doing that day.</p>
        </EmptyState>
      )}
      {visits.length > 0 && (
        <div className="visit-log__overview">
          <VisitStats visits={visits} />
          <TasteMap
            visits={visits}
            quadrant={quadrant}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
          <QuadrantFilter
            options={filterOptions}
            value={quadrant}
            onChange={(key) => {
              setQuadrant(key);
              setSelectedId(null);
            }}
          />
        </div>
      )}
      {visits.length > 0 && shown.length === 0 && (
        <p className="visit-log__none">No visits in this corner yet.</p>
      )}
      {groupByMonth(shown).map((group) => (
        <section key={group.label} className="visit-log__month" aria-label={group.label}>
          <h2 className="visit-log__month-title">{group.label}</h2>
          <ul className="visit-log__list">
            {group.visits.map((visit) => (
              <li key={visit._id} id={`visit-${visit._id}`}>
                <VisitItem
                  visit={visit}
                  highlighted={visit._id === selectedId}
                  onEdit={() => setEditing(visit)}
                  onDelete={() => handleDelete(visit._id)}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}

// Takes no props.
VisitLogPage.propTypes = {};
