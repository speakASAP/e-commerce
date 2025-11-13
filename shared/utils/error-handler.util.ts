/**
 * Error Handler Utility
 * Standardized error handling
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponseUtil } from './api-response.util';

export class AppError extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    code?: string,
    details?: any,
  ) {
    super(
      {
        ...ApiResponseUtil.error(code || 'INTERNAL_ERROR', message, details),
      },
      statusCode,
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      `${resource} not found${id ? ` with id: ${id}` : ''}`,
      HttpStatus.NOT_FOUND,
      'NOT_FOUND',
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}

