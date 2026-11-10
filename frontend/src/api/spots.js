import { request } from './client.js';

export const listSpotLists = (signal) => request('/spots', { signal });
export const getSpotList = (id, signal) => request(`/spots/${id}`, { signal });
export const createSpotList = (list) => request('/spots', { method: 'POST', body: list });
export const updateSpotList = (id, list) => request(`/spots/${id}`, { method: 'PUT', body: list });
export const deleteSpotList = (id) => request(`/spots/${id}`, { method: 'DELETE' });
