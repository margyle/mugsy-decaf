// Custom application error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capturing the stack trace
    Error.captureStackTrace(this, this.constructor);

    // Setting prototype explicitly for better instanceof support
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Common error factories
export const NotFoundError = (message = 'Resource not found') =>
  new AppError(message, 404);

export const BadRequestError = (message = 'Bad request') =>
  new AppError(message, 400);

export const UnauthorizedError = (message = 'Unauthorized') =>
  new AppError(message, 401);

export const ForbiddenError = (message = 'Forbidden') =>
  new AppError(message, 403);

export const ConflictError = (message = 'Conflict with existing resource') =>
  new AppError(message, 409);

export const InternalServerError = (
  message = 'Internal server error',
  isOperational = false,
) => new AppError(message, 500, isOperational);
