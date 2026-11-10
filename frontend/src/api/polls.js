import { request } from './client.js';

export const listPolls = (signal) => request('/polls', { signal });
export const getPoll = (id, signal) => request(`/polls/${id}`, { signal });
export const createPoll = (poll) => request('/polls', { method: 'POST', body: poll });
export const updatePoll = (id, poll) => request(`/polls/${id}`, { method: 'PUT', body: poll });
export const deletePoll = (id) => request(`/polls/${id}`, { method: 'DELETE' });
export const castVote = (id, restaurantId) =>
  request(`/polls/${id}/vote`, { method: 'POST', body: { restaurantId } });
