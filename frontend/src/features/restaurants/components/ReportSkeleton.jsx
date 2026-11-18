import Skeleton from '../../../components/Skeleton.jsx';
import './ReportSkeleton.css';

// Placeholder in the shape of a kitchen report while it loads.
export default function ReportSkeleton() {
  return (
    <div className="report-skeleton" aria-busy="true">
      <span className="visually-hidden">Loading report…</span>
      <Skeleton width="120px" height="1rem" />
      <div className="report-skeleton__hero">
        <Skeleton width="110px" height="0.8rem" />
        <Skeleton width="min(520px, 90%)" height="3.4rem" />
        <Skeleton width="min(320px, 70%)" height="1.1rem" />
        <div className="report-skeleton__stats">
          {['last', 'result', 'serious', 'trend'].map((name) => (
            <Skeleton key={name} height="3rem" />
          ))}
        </div>
      </div>
      <div className="report-skeleton__card">
        <Skeleton width="240px" height="2rem" />
        <Skeleton height="160px" />
        <Skeleton width="60%" height="1rem" />
      </div>
    </div>
  );
}

ReportSkeleton.propTypes = {};
