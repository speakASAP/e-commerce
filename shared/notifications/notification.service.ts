/**
 * Notification Service
 * Service to send notifications via notification-microservice
 */

import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  SendNotificationDto,
  NotificationResponse,
  NotificationChannel,
} from './notification.interface';

@Injectable()
export class NotificationService {
  private readonly notificationServiceUrl: string;
  private readonly logger: LoggerService;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    logger: LoggerService,
  ) {
    this.notificationServiceUrl =
      this.configService.get<string>('NOTIFICATION_SERVICE_URL') ||
      'http://notification-microservice:3010';
    this.logger = logger;
  }

  /**
   * Send notification via notification-microservice
   */
  async sendNotification(
    dto: SendNotificationDto,
  ): Promise<NotificationResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<NotificationResponse>(
          `${this.notificationServiceUrl}/notifications/send`,
          dto,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          },
        ),
      );

      this.logger.log(`Notification sent successfully`, {
        channel: dto.channel,
        type: dto.type,
        recipient: dto.recipient,
        notificationId: response.data?.data?.id,
      });

      return response.data;
    } catch (error: any) {
      // Log error but don't throw - notifications are non-critical
      this.logger.error('Failed to send notification', {
        error: error.message,
        channel: dto.channel,
        type: dto.type,
        recipient: dto.recipient,
        stack: error.stack,
      });

      // Return error response instead of throwing
      return {
        success: false,
        error: {
          code: 'NOTIFICATION_FAILED',
          message: error.message || 'Failed to send notification',
        },
      };
    }
  }

  /**
   * Send order confirmation notification
   */
  async sendOrderConfirmation(
    recipient: string,
    orderNumber: string,
    orderTotal: number,
    channel: NotificationChannel = 'email',
  ): Promise<NotificationResponse> {
    return this.sendNotification({
      channel,
      type: 'order_confirmation',
      recipient,
      subject: `Potvrzení objednávky ${orderNumber}`,
      message: `Vaše objednávka {{orderNumber}} byla úspěšně vytvořena. Celková částka: {{orderTotal}} Kč.`,
      templateData: {
        orderNumber,
        orderTotal: orderTotal.toFixed(2),
      },
    });
  }

  /**
   * Send payment confirmation notification
   */
  async sendPaymentConfirmation(
    recipient: string,
    orderNumber: string,
    paymentAmount: number,
    channel: NotificationChannel = 'email',
  ): Promise<NotificationResponse> {
    return this.sendNotification({
      channel,
      type: 'payment_confirmation',
      recipient,
      subject: `Potvrzení platby za objednávku ${orderNumber}`,
      message: `Platba za objednávku {{orderNumber}} byla úspěšně přijata. Částka: {{paymentAmount}} Kč.`,
      templateData: {
        orderNumber,
        paymentAmount: paymentAmount.toFixed(2),
      },
    });
  }

  /**
   * Send order status update notification
   */
  async sendOrderStatusUpdate(
    recipient: string,
    orderNumber: string,
    status: string,
    channel: NotificationChannel = 'email',
  ): Promise<NotificationResponse> {
    return this.sendNotification({
      channel,
      type: 'order_status_update',
      recipient,
      subject: `Aktualizace stavu objednávky ${orderNumber}`,
      message: `Stav vaší objednávky {{orderNumber}} byl aktualizován na: {{status}}.`,
      templateData: {
        orderNumber,
        status,
      },
    });
  }

  /**
   * Send shipment tracking notification
   */
  async sendShipmentTracking(
    recipient: string,
    orderNumber: string,
    trackingNumber: string,
    channel: NotificationChannel = 'email',
  ): Promise<NotificationResponse> {
    return this.sendNotification({
      channel,
      type: 'shipment_tracking',
      recipient,
      subject: `Informace o odeslání objednávky ${orderNumber}`,
      message: `Vaše objednávka {{orderNumber}} byla odeslána. Sledovací číslo: {{trackingNumber}}.`,
      templateData: {
        orderNumber,
        trackingNumber,
      },
    });
  }
}
