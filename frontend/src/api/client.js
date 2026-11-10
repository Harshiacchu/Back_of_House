// The single place the frontend talks to the backend (Fetch API, same-origin cookies).
export class ApiError extends Error {
  constructor(status, message, data = {}) {
    super(message);
    this.status = status;
    this.details = data.details;
    this.data = data;
  }
}

export async function request(path, { method = 'GET', body, signal } = {}) {
  const response = await fetch(`/api${path}`, {
    method,
    signal,
    credentials: 'same-origin',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const fallback =
      response.status >= 500
        ? 'The kitchen server isn’t responding right now. Try again in a moment.'
        : response.statusText;
    throw new ApiError(response.status, data.error || fallback, data);
  }
  return data;
}

export function toQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  const text = search.toString();
  return text ? `?${text}` : '';
}
