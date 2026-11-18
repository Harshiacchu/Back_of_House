import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getRestaurant } from '../../../api/restaurants.js';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import ShareButton from '../../../components/ShareButton.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { drawKitchenCard } from '../../../utils/shareCards.js';
import { toFileSlug } from '../../../utils/shareImage.js';
import InspectionDetail from '../components/InspectionDetail.jsx';
import InspectionTimeline from '../components/InspectionTimeline.jsx';
import ProblemAreas from '../components/ProblemAreas.jsx';
import ReportHero from '../components/ReportHero.jsx';
import ReportSkeleton from '../components/ReportSkeleton.jsx';
import './RestaurantDetailPage.css';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loader = useCallback((signal) => getRestaurant(id, signal), [id]);
  const { data, error, loading, reload } = useFetch(loader);
  const [pickedId, setPickedId] = useState(null);
  useDocumentTitle(data?.restaurant.name ?? 'Kitchen Report');

  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;
  if (loading || !data) return <ReportSkeleton />;

  const { restaurant, inspections } = data;
  const selected = inspections.find((i) => i._id === pickedId) ?? inspections[0];
  const visitLink = `/visits?restaurant=${restaurant._id}&name=${encodeURIComponent(restaurant.name)}`;

  // Back keeps the search the user came from (its filters live in the URL).
  function handleBack(event) {
    if (window.history.state?.idx > 0) {
      event.preventDefault();
      navigate(-1);
    }
  }

  return (
    <article className="restaurant-detail">
      <Link to="/restaurants" className="restaurant-detail__back" onClick={handleBack}>
        ‹ Kitchen Reports
      </Link>

      <ReportHero
        restaurant={restaurant}
        inspections={inspections}
        actions={
          <>
            <Link to={visitLink} className="btn btn--primary">
              Log a visit
            </Link>
            <ShareButton
              label="Share report"
              className="btn restaurant-detail__share"
              makeImage={async () => ({
                blob: await drawKitchenCard(data),
                fileName: `${toFileSlug(restaurant.name)}-kitchen-report.png`,
                title: `${restaurant.name}: kitchen report`,
              })}
            />
          </>
        }
      />

      {selected && (
        <section className="restaurant-detail__section" aria-labelledby="timeline-title">
          <div className="restaurant-detail__section-head">
            <h2 id="timeline-title">Every inspection</h2>
            <p>{inspections.length} on record. Tap a bar to see what inspectors found that day.</p>
          </div>
          <InspectionTimeline
            inspections={inspections}
            selectedId={selected._id}
            onSelect={setPickedId}
          />
          <InspectionDetail key={selected._id} inspection={selected} />
        </section>
      )}

      <section className="restaurant-detail__section" aria-labelledby="areas-title">
        <div className="restaurant-detail__section-head">
          <h2 id="areas-title">What keeps coming up</h2>
          <p>Every kind of problem cited here since 2023, most recent first.</p>
        </div>
        <ProblemAreas inspections={inspections} />
      </section>
    </article>
  );
}

// Takes no props.
RestaurantDetailPage.propTypes = {};
