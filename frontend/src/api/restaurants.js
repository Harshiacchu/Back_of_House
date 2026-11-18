import { request, toQuery } from './client.js';

// GET /api/restaurants?q&neighborhood&trajectory&sort&cursor&limit
//   -> { items: [restaurantSummary], total (first page only, else null), nextCursor }
export const searchRestaurants = (params, signal) =>
  request(`/restaurants${toQuery(params)}`, { signal });

// GET /api/restaurants/suggest?q= -> { suggestions: [{ _id, name, neighborhood, summary }] }
export const suggestRestaurants = (q, signal) =>
  request(`/restaurants/suggest${toQuery({ q })}`, { signal });

// GET /api/restaurants/heatmap -> { hoods, points: [[lng, lat, hood]], quarters: [{ label, cells: [point, score, …] }] }
export const getHeatmap = (signal) => request('/restaurants/heatmap', { signal });

// GET /api/restaurants/neighborhoods -> { neighborhoods: [string] }
export const getNeighborhoods = (signal) => request('/restaurants/neighborhoods', { signal });

// GET /api/restaurants/:id -> { restaurant, inspections: [inspection] } (newest first)
export const getRestaurant = (id, signal) => {
  if (id == null || String(id).trim() === '') {
    return Promise.reject(
      new Error('Please provide a valid restaurant ID.')
    );
  }
  return request(`/restaurants/${id}`, { signal });
};
