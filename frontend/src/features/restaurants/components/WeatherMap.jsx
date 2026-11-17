import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  buildGrid,
  drawDots,
  mixColors,
  neighborhoodLabels,
  projectPoints,
  quarterSquares,
} from '../kitchenWeather.js';
import './WeatherMap.css';

const COLUMNS = 26;
// Same mixes as the legend swatches in KitchenWeather.css.
const SOFT_BLUE = 0.4;
const CALM_GREY = 0.6;
const token = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();

// The dot map: a canvas sized to its box, neighborhood names as buttons on top, and a small
// card describing whichever dot the pointer is over.
export default function WeatherMap({ data, cells, label, selected, onPick }) {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const [size, setSize] = useState(null);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, []);

  const grid = useMemo(() => {
    if (!size) return null;
    const xy = projectPoints(data.points, size.width, size.height);
    return buildGrid(data, xy, Math.max(12, size.width / COLUMNS));
  }, [data, size]);
  const stats = useMemo(() => (grid ? quarterSquares(grid, cells) : null), [grid, cells]);
  const labels = useMemo(() => (grid ? neighborhoodLabels(grid) : []), [grid]);

  useEffect(() => {
    if (!grid) return;
    drawDots(canvasRef.current, {
      ...size,
      grid,
      stats,
      selected,
      colors: {
        empty: token('color-border'),
        low: mixColors(token('color-text-tertiary'), token('color-surface'), CALM_GREY),
        medium: mixColors(token('color-accent'), token('color-surface'), SOFT_BLUE),
        high: token('color-accent'),
        selected: token('color-text'),
      },
    });
  }, [size, grid, stats, selected]);

  function handlePointerMove(event) {
    if (!grid) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const key = `${Math.floor(x / grid.cellSize)},${Math.floor(y / grid.cellSize)}`;
    const square = grid.squares.get(key);
    setHover(square ? { square, stat: stats.get(key) } : null);
  }

  const tipStyle = hover && {
    left: `${(hover.square.cx / size.width) * 100}%`,
    top: `${(hover.square.cy / size.height) * 100}%`,
  };

  return (
    <div ref={boxRef} className="weather-map">
      <canvas
        ref={canvasRef}
        className="weather-map__canvas"
        role="img"
        aria-label={label}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHover(null)}
      />
      {size &&
        labels.map((place) => (
          <button
            key={place.name}
            type="button"
            className="weather-map__place"
            style={{
              left: `${(place.x / size.width) * 100}%`,
              top: `${(place.y / size.height) * 100}%`,
            }}
            aria-pressed={selected === place.name}
            onClick={() => onPick(place.name)}
          >
            {place.name}
          </button>
        ))}
      {hover && (
        <div className="weather-map__tip" style={tipStyle} aria-hidden="true">
          <strong>{hover.square.hood}</strong>
          {hover.stat ? (
            <span>
              {hover.stat.n} inspected · {hover.stat.concerns} with concerns
              {hover.stat.serious > 0 && ` · ${hover.stat.serious} serious`}
            </span>
          ) : (
            <span>No inspections this quarter</span>
          )}
        </div>
      )}
    </div>
  );
}

WeatherMap.propTypes = {
  data: PropTypes.shape({
    hoods: PropTypes.arrayOf(PropTypes.string).isRequired,
    points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  }).isRequired,
  cells: PropTypes.arrayOf(PropTypes.number).isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  onPick: PropTypes.func.isRequired,
};
