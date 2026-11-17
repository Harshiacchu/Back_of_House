import PropTypes from 'prop-types';

import { formatDate } from '../../../utils/format.js';
import { seriousInPastYear } from '../../../utils/inspections.js';
import { inspectionShape } from '../../../utils/propShapes.js';
import { SEVERITY_LABELS, severityLevel } from '../../../utils/severity.js';
import ScoreTile from './ScoreTile.jsx';
import './ReportHero.css';

const TREND_TEXT = {
  Improving: '↗ Improving',
  Steady: '→ Steady',
  Slipping: '↘ Slipping',
};

// The top of a kitchen report: the verdict at a glance, styled like the share card.
export default function ReportHero({ restaurant, inspections, actions }) {
  const summary = restaurant.summary ?? {};
  const score = summary.severityScore ?? 0;
  const serious = seriousInPastYear(inspections);
  const stats = [
    ['Last inspected', formatDate(summary.lastInspectionDate)],
    ['Result', summary.lastResult || '—'],
    ['Serious violations, past year', String(serious)],
    ['Trend', TREND_TEXT[summary.trajectory] ?? 'Not enough history'],
  ];

  return (
    <header className="report-hero">
      <div className="report-hero__top">
        <div className="report-hero__heading">
          <p className="report-hero__eyebrow">Kitchen report</p>
          <h1 className="report-hero__name">{restaurant.name}</h1>
          <p className="report-hero__address">
            {[restaurant.address, restaurant.neighborhood].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="report-hero__verdict">
          <ScoreTile score={score} size="large" />
          <span className="report-hero__verdict-text">
            {score === 0 ? 'Spotless lately' : SEVERITY_LABELS[severityLevel(score)]}
            <span>Worst of the last 3 inspections, out of 100</span>
          </span>
        </div>
      </div>

      <dl className="report-hero__stats">
        {stats.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="report-hero__actions">{actions}</div>
    </header>
  );
}

ReportHero.propTypes = {
  restaurant: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string,
    neighborhood: PropTypes.string,
    summary: PropTypes.shape({
      severityScore: PropTypes.number,
      trajectory: PropTypes.string,
      lastInspectionDate: PropTypes.string,
      lastResult: PropTypes.string,
    }),
  }).isRequired,
  inspections: PropTypes.arrayOf(inspectionShape).isRequired,
  actions: PropTypes.node,
};
