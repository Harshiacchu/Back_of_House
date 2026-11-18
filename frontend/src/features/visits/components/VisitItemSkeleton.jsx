import Skeleton from '../../../components/Skeleton.jsx';
import './VisitItem.css';
import './VisitItemSkeleton.css';

// Same shape as VisitItem while the log loads.
export default function VisitItemSkeleton() {
  return (
    <div className="visit-item visit-item-skeleton">
      <span className="visit-item__header">
        <Skeleton width="90px" height="0.85rem" />
        <Skeleton width="70px" height="0.85rem" />
      </span>
      <Skeleton width="75%" height="1.4rem" />
      <Skeleton width="50%" height="0.95rem" />
      <Skeleton width="100%" height="64px" />
      <span className="visit-item-skeleton__actions">
        <Skeleton width="56px" height="32px" />
        <Skeleton width="64px" height="32px" />
      </span>
    </div>
  );
}

VisitItemSkeleton.propTypes = {};
