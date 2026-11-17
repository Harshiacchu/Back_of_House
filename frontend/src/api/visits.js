import { request, toQuery } from './client.js';

// GET /api/visits -> { items: [visit] } (newest first, each with inspectionAtVisit)
export const listVisits = (signal) => request('/visits', { signal });
// GET /api/visits/recap?year= -> { recap: { year, meals, neighborhoods, cleanShare, ... } }
export const getVisitRecap = (year, signal) =>
  request(`/visits/recap${toQuery({ year })}`, { signal });
// body: { restaurantId, visitDate, dish, rating, notes } -> { visit }
export const createVisit = (visit) => request('/visits', { method: 'POST', body: visit });
export const updateVisit = (id, visit) => request(`/visits/${id}`, { method: 'PUT', body: visit });
export const deleteVisit = (id) => request(`/visits/${id}`, { method: 'DELETE' });
