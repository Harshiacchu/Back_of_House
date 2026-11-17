import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getHeatmap } from '../../../api/restaurants.js';
import ErrorMessage from '../../../components/ErrorMessage.jsx';
import Skeleton from '../../../components/Skeleton.jsx';
import { useFetch } from '../../../hooks/useFetch.js';
import { useInView } from '../../../hooks/useInView.js';
import { summarizeQuarter } from '../kitchenWeather.js';
import QuarterScrubber from './QuarterScrubber.jsx';
import WeatherMap from './WeatherMap.jsx';
import './KitchenWeather.css';

const NOT_YET = new Promise(() => {});
const STEP_MS = 900;

// Kitchen Weather: which parts of Boston had kitchen problems, one quarter at a time, as a dot
// map. The data is only requested once the section scrolls into view.
export default function KitchenWeather({ neighborhood, onPickNeighborhood }) {
  const [ref, inView] = useInView({ threshold: 0.05 });
  const loader = useCallback((signal) => (inView ? getHeatmap(signal) : NOT_YET), [inView]);
  const { data, error, reload } = useFetch(loader);

  const quarters = useMemo(
    () =>
      data
        ? data.quarters.map((q, i) => summarizeQuarter(q, data, i === data.quarters.length - 1))
        : [],
    [data],
  );
  const last = quarters.length - 1;
  const [picked, setPicked] = useState(null);
  const [playing, setPlaying] = useState(false);
  const index = picked ?? last;

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(
      () => setPicked((i) => ((i ?? last) >= last ? 0 : (i ?? last) + 1)),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [playing, last]);

  const quarter = quarters[index];
  const mapLabel = quarter
    ? `Dot map of Boston for ${quarter.title}: ${quarter.inspected} kitchens inspected, ` +
      `${quarter.concerns} with real concerns. Most concerns: ${quarter.hotspots.map(([n]) => n).join(', ')}.`
    : '';

  return (
    <section ref={ref} className="kitchen-weather" aria-labelledby="kitchen-weather-title">
      <div className="kitchen-weather__map">
        {error && <ErrorMessage message={error.message} onRetry={reload} />}
        {!error && !quarter && <Skeleton height="100%" />}
        {quarter && (
          <WeatherMap
            data={data}
            cells={data.quarters[index].cells}
            label={mapLabel}
            selected={neighborhood}
            onPick={onPickNeighborhood}
          />
        )}
      </div>

      <div className="kitchen-weather__panel">
        <p className="eyebrow">Kitchen weather</p>
        <h2 id="kitchen-weather-title" className="kitchen-weather__title">
          How clean was each part of Boston?
        </h2>
        <p className="kitchen-weather__lead">
          Each dot is a few city blocks. Bigger dots had more kitchens inspected that quarter. Press
          play to see how the city changed since 2023.
        </p>
        <ul className="kitchen-weather__legend" aria-label="What the dot colors mean">
          <li>
            <span className="kitchen-weather__swatch kitchen-weather__swatch--low" />
            Mostly fine
          </li>
          <li>
            <span className="kitchen-weather__swatch kitchen-weather__swatch--medium" />
            Some concerns (1 in 5+)
          </li>
          <li>
            <span className="kitchen-weather__swatch kitchen-weather__swatch--high" />
            Many concerns (2 in 5+)
          </li>
        </ul>

        {quarter ? (
          <>
            <p className="kitchen-weather__quarter" aria-live="polite">
              {quarter.title}
            </p>
            <dl className="kitchen-weather__stats">
              <div>
                <dt>Inspected</dt>
                <dd>{quarter.inspected.toLocaleString()}</dd>
              </div>
              <div>
                <dt>Concerns</dt>
                <dd className="kitchen-weather__stat--medium">
                  {quarter.concerns.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt>Serious</dt>
                <dd className="kitchen-weather__stat--high">{quarter.serious.toLocaleString()}</dd>
              </div>
            </dl>

            <QuarterScrubber
              quarters={quarters}
              index={index}
              onChange={(i) => {
                setPlaying(false);
                setPicked(i);
              }}
              playing={playing}
              onTogglePlay={() => setPlaying((p) => !p)}
            />

            <div className="kitchen-weather__hotspots">
              <span className="kitchen-weather__hotspots-title">Most concerns this quarter</span>
              <ul>
                {quarter.hotspots.map(([name, count]) => (
                  <li key={name}>
                    <button
                      type="button"
                      className="kitchen-weather__hotspot"
                      aria-pressed={neighborhood === name}
                      onClick={() => onPickNeighborhood(name)}
                    >
                      <span>{name}</span>
                      <span className="kitchen-weather__hotspot-count">{count}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <span className="kitchen-weather__hint">
                Pick a neighborhood here or on the map to list its kitchens below.
              </span>
            </div>
          </>
        ) : (
          <div className="kitchen-weather__panel-loading">
            <Skeleton width="40%" height="1.8rem" />
            <Skeleton width="100%" height="64px" />
            <Skeleton width="100%" height="64px" />
          </div>
        )}
      </div>
    </section>
  );
}

KitchenWeather.propTypes = {
  neighborhood: PropTypes.string.isRequired,
  onPickNeighborhood: PropTypes.func.isRequired,
};
