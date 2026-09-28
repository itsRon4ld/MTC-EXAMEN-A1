import { ErrorCode, ErrorCodes } from './errorCodes';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(
    code: ErrorCode = ErrorCodes.INTERNAL_SERVER_ERROR,
    message: string,
    statusCode: number = 500,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string, code: ErrorCode = ErrorCodes.VALIDATION_ERROR, details?: unknown) {
    return new AppError(code, message, 400, details);
  }

  static unauthorized(message: string = 'No autorizado. Inicia sesión para continuar.', code: ErrorCode = ErrorCodes.AUTH_UNAUTHORIZED) {
    return new AppError(code, message, 401);
  }

  static notFound(message: string, code: ErrorCode = ErrorCodes.QUESTION_NOT_FOUND) {
    return new AppError(code, message, 404);
  }

  static conflict(message: string, code: ErrorCode = ErrorCodes.AUTH_USER_ALREADY_EXISTS) {
    return new AppError(code, message, 409);
  }

  static internal(message: string = 'Error interno del servidor', details?: unknown) {
    return new AppError(ErrorCodes.INTERNAL_SERVER_ERROR, message, 500, details);
  }
}
