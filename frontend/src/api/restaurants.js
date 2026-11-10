import { request, toQuery } from './client.js';

// GET /api/restaurants -> { items: [restaurantSummary], page, totalPages, total }
export const searchRestaurants = (params, signal) =>
  request(`/restaurants${toQuery(params)}`, { signal });

// GET /api/restaurants/neighborhoods -> { neighborhoods: [string] }
export const getNeighborhoods = (signal) => request('/restaurants/neighborhoods', { signal });

// GET /api/restaurants/:id -> { restaurant, inspections: [inspection] } (newest first)
export const getRestaurant = (id, signal) => request(`/restaurants/${id}`, { signal });
