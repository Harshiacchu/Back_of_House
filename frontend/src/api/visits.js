import { request } from './client.js';

// GET /api/visits -> { items: [visit] } (newest first, each with inspectionAtVisit)
export const listVisits = (signal) => request('/visits', { signal });
// body: { restaurantId, visitDate, dish, rating, notes } -> { visit }
export const createVisit = (visit) => request('/visits', { method: 'POST', body: visit });
export const updateVisit = (id, visit) => request(`/visits/${id}`, { method: 'PUT', body: visit });
export const deleteVisit = (id) => request(`/visits/${id}`, { method: 'DELETE' });
