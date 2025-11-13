/**
 * API Response Utility
 * Standardized API response formatters
 */

import { ApiResponse, HttpStatus } from '../types/common.types';

export class ApiResponseUtil {
  static success<T>(data: T, meta?: ApiResponse<T>['meta']): ApiResponse<T> {
    return {
      success: true,
      data,
      meta,
    };
  }

  static error(
    code: string,
    message: string,
    details?: any,
  ): ApiResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
    };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): ApiResponse<T[]> {
    return {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
      },
    };
  }
}

