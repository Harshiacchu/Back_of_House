import Skeleton from '../../../components/Skeleton.jsx';
import './RestaurantCard.css';
import './RestaurantCardSkeleton.css';

// Same shape as RestaurantCard, so nothing jumps when the results arrive.
export default function RestaurantCardSkeleton() {
  return (
    <div className="restaurant-card restaurant-card-skeleton">
      <span className="restaurant-card__top">
        <Skeleton width="68px" height="68px" />
        <span className="restaurant-card__title restaurant-card-skeleton__title">
          <Skeleton width="40%" height="0.8rem" />
          <Skeleton width="85%" height="1.3rem" />
        </span>
      </span>
      <Skeleton width="60%" height="0.9rem" />
      <Skeleton width="55%" height="36px" />
      <span className="restaurant-card__footer">
        <Skeleton width="90px" height="1.6rem" />
        <Skeleton width="120px" height="0.8rem" />
      </span>
    </div>
  );
}

RestaurantCardSkeleton.propTypes = {};
