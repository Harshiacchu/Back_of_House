export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    if (details) this.details = details;
  }
}

export class ValidationError extends HttpError {
  constructor(details, message = 'Validation failed') {
    super(400, message, details);
  }
}

export const badRequest = (message) => new HttpError(400, message);
export const unauthorized = (message = 'Please log in') => new HttpError(401, message);
export const forbidden = (message = 'You do not have access to this') =>
  new HttpError(403, message);
export const notFound = (what = 'Resource') => new HttpError(404, `${what} not found`);
export const conflict = (message) => new HttpError(409, message);
