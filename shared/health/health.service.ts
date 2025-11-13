/**
 * Health Check Service
 * Provides health check functionality with dependency checking
 */

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'unhealthy';
  timestamp: string;
  service: string;
  dependencies?: {
    database?: {
      status: 'ok' | 'error';
      message?: string;
    };
    logging?: {
      status: 'ok' | 'error';
      message?: string;
    };
    notification?: {
      status: 'ok' | 'error';
      message?: string;
    };
    redis?: {
      status: 'ok' | 'error';
      message?: string;
    };
  };
}

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Check database connection health
   */
  async checkDatabase(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      await this.connection.query('SELECT 1');
      return { status: 'ok' };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Database connection failed',
      };
    }
  }

  /**
   * Check logging service health
   */
  async checkLoggingService(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      const loggingServiceUrl =
        this.configService.get<string>('LOGGING_SERVICE_URL') ||
        'http://logging-microservice:3009';
      const url = loggingServiceUrl.replace('/api/logs', '/health');

      const response = await firstValueFrom(
        this.httpService.get(url).pipe(
          timeout(3000),
          catchError(() => {
            throw new Error('Logging service unavailable');
          }),
        ),
      );

      if (response.data?.success || response.data?.status === 'ok') {
        return { status: 'ok' };
      }

      return {
        status: 'error',
        message: 'Logging service returned unhealthy status',
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Logging service unavailable',
      };
    }
  }

  /**
   * Check notification service health
   */
  async checkNotificationService(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      const notificationServiceUrl =
        this.configService.get<string>('NOTIFICATION_SERVICE_URL') ||
        'http://notification-microservice:3010';

      const response = await firstValueFrom(
        this.httpService.get(`${notificationServiceUrl}/health`).pipe(
          timeout(3000),
          catchError(() => {
            throw new Error('Notification service unavailable');
          }),
        ),
      );

      if (response.data?.success || response.data?.status === 'ok') {
        return { status: 'ok' };
      }

      return {
        status: 'error',
        message: 'Notification service returned unhealthy status',
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Notification service unavailable',
      };
    }
  }

  /**
   * Check Redis connection health
   */
  async checkRedis(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    // Redis check would require Redis client
    // For now, return ok if Redis is not critical
    // Can be enhanced when Redis module is used
    return { status: 'ok' };
  }

  /**
   * Get comprehensive health status
   */
  async getHealthStatus(serviceName: string): Promise<HealthStatus> {
    const dependencies: HealthStatus['dependencies'] = {};
    let overallStatus: 'ok' | 'degraded' | 'unhealthy' = 'ok';

    // Check database (critical)
    const dbHealth = await this.checkDatabase();
    dependencies.database = dbHealth;
    if (dbHealth.status === 'error') {
      overallStatus = 'unhealthy';
    }

    // Check logging service (non-critical)
    try {
      dependencies.logging = await this.checkLoggingService();
      if (dependencies.logging.status === 'error' && overallStatus === 'ok') {
        overallStatus = 'degraded';
      }
    } catch (error) {
      dependencies.logging = { status: 'error', message: 'Check failed' };
      if (overallStatus === 'ok') {
        overallStatus = 'degraded';
      }
    }

    // Check notification service (non-critical, only for order-service)
    if (serviceName === 'order-service') {
      try {
        dependencies.notification = await this.checkNotificationService();
        if (dependencies.notification.status === 'error' && overallStatus === 'ok') {
          overallStatus = 'degraded';
        }
      } catch (error) {
        dependencies.notification = { status: 'error', message: 'Check failed' };
        if (overallStatus === 'ok') {
          overallStatus = 'degraded';
        }
      }
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      service: serviceName,
      dependencies,
    };
  }
}
