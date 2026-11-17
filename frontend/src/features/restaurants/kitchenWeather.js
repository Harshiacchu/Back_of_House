// Helpers for the Kitchen Weather map: a dot-grid map on <canvas>, no map library or tiles.
// The city is cut into small squares; each square with restaurants is one flat dot.
//   size   = how many kitchens were inspected there that quarter
//   colour = the share of them with real concerns: grey (fine), soft red (some), red (many)

export const CONCERNS_FROM = 20; // matches utils/severity.js
export const SERIOUS_FROM = 50;
export const SHARE_BANDS = { medium: 0.2, high: 0.4 };
const FULL_DOT_AT = 14; // kitchens in one square for the biggest dot
// Squares with only a few kitchens are pulled toward the city-wide rate, so one bad kitchen
// can't paint its whole square red.
const CITY_RATE = 0.25;
const PRIOR_KITCHENS = 3;

export const concernShare = ({ n, concerns }) =>
  (concerns + CITY_RATE * PRIOR_KITCHENS) / (n + PRIOR_KITCHENS);

// Mixes two CSS colours in sRGB, like CSS color-mix(), for use on the canvas.
export function mixColors(a, b, amountOfA) {
  const ctx = document.createElement('canvas').getContext('2d');
  const rgb = (color) => {
    ctx.fillStyle = '#000';
    ctx.fillStyle = color;
    return [1, 3, 5].map((i) => Number.parseInt(ctx.fillStyle.slice(i, i + 2), 16));
  };
  const [x, y] = [rgb(a), rgb(b)];
  return `rgb(${x.map((v, i) => Math.round(v * amountOfA + y[i] * (1 - amountOfA))).join(' ')})`;
}

export function shareLevel(share) {
  if (share >= SHARE_BANDS.high) return 'high';
  if (share >= SHARE_BANDS.medium) return 'medium';
  return 'low';
}

// Per-quarter numbers shown next to the map.
export function summarizeQuarter(quarter, data, isLatest) {
  let concerns = 0;
  let serious = 0;
  const byHood = new Map();
  for (let i = 0; i < quarter.cells.length; i += 2) {
    const score = quarter.cells[i + 1];
    if (score < CONCERNS_FROM) continue;
    concerns += 1;
    if (score >= SERIOUS_FROM) serious += 1;
    const hood = data.hoods[data.points[quarter.cells[i]][2]];
    byHood.set(hood, (byHood.get(hood) ?? 0) + 1);
  }
  const now = new Date();
  const current = `${now.getFullYear()} Q${Math.ceil((now.getMonth() + 1) / 3)}`;
  return {
    label: quarter.label,
    title: isLatest && quarter.label === current ? `${quarter.label}, so far` : quarter.label,
    inspected: quarter.cells.length / 2,
    concerns,
    serious,
    hotspots: [...byHood.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3),
  };
}

// Longitude/latitude -> pixels, keeping the city's real proportions.
export function projectPoints(points, width, height, pad = 20) {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of points) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  const squash = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const spanX = (maxLng - minLng) * squash;
  const spanY = maxLat - minLat;
  const scale = Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY);
  const offX = (width - spanX * scale) / 2;
  const offY = (height - spanY * scale) / 2;
  return points.map(([lng, lat]) => [
    offX + (lng - minLng) * squash * scale,
    offY + (maxLat - lat) * scale,
  ]);
}

// Assigns every restaurant to a square of the grid. Each square remembers its centre and the
// neighborhood most of its restaurants belong to.
export function buildGrid(data, xy, cellSize) {
  const squareOf = new Array(xy.length);
  const squares = new Map();
  xy.forEach(([x, y], i) => {
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    const key = `${col},${row}`;
    squareOf[i] = key;
    if (!squares.has(key)) {
      squares.set(key, {
        key,
        cx: (col + 0.5) * cellSize,
        cy: (row + 0.5) * cellSize,
        hoods: new Map(),
      });
    }
    const hood = data.points[i][2];
    const counts = squares.get(key).hoods;
    counts.set(hood, (counts.get(hood) ?? 0) + 1);
  });
  for (const square of squares.values()) {
    square.hood = data.hoods[[...square.hoods.entries()].sort((a, b) => b[1] - a[1])[0][0]];
  }
  return { squareOf, squares, cellSize };
}

// One quarter's numbers per square: kitchens inspected, with concerns, serious.
export function quarterSquares(grid, cells) {
  const stats = new Map();
  for (let i = 0; i < cells.length; i += 2) {
    const key = grid.squareOf[cells[i]];
    const s = stats.get(key) ?? { n: 0, concerns: 0, serious: 0 };
    s.n += 1;
    if (cells[i + 1] >= CONCERNS_FROM) s.concerns += 1;
    if (cells[i + 1] >= SERIOUS_FROM) s.serious += 1;
    stats.set(key, s);
  }
  return stats;
}

export function dotRadius(n, cellSize) {
  return Math.max(2.5, cellSize * 0.47 * Math.min(1, Math.sqrt(n / FULL_DOT_AT)));
}

// Squares with restaurants but no inspection that quarter get a faint dot, so the shape of the
// city stays put while the coloured dots change.
export function drawDots(canvas, { width, height, grid, stats, selected, colors }) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  for (const square of grid.squares.values()) {
    const s = stats.get(square.key);
    ctx.beginPath();
    if (!s) {
      ctx.arc(square.cx, square.cy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = colors.empty;
      ctx.fill();
      continue;
    }
    const r = dotRadius(s.n, grid.cellSize);
    ctx.arc(square.cx, square.cy, r, 0, Math.PI * 2);
    ctx.fillStyle = colors[shareLevel(concernShare(s))];
    ctx.fill();
    if (selected && square.hood === selected) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = colors.selected;
      ctx.beginPath();
      ctx.arc(square.cx, square.cy, r + 2.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Text labels for the biggest neighborhoods, skipping any that would overlap.
export function neighborhoodLabels(grid, max = 8) {
  const byHood = new Map();
  for (const square of grid.squares.values()) {
    const h = byHood.get(square.hood) ?? { name: square.hood, x: 0, y: 0, n: 0 };
    h.x += square.cx;
    h.y += square.cy;
    h.n += 1;
    byHood.set(square.hood, h);
  }
  const placed = [];
  [...byHood.values()]
    .sort((a, b) => b.n - a.n)
    .forEach((h) => {
      const x = h.x / h.n;
      const y = h.y / h.n;
      const clash = placed.some((p) => Math.abs(p.x - x) < 96 && Math.abs(p.y - y) < 30);
      if (!clash && placed.length < max) placed.push({ name: h.name, x, y });
    });
  return placed;
}
