/**
 * Notification Service Interfaces
 */

export type NotificationChannel = 'email' | 'telegram' | 'whatsapp';

export type NotificationType =
  | 'order_confirmation'
  | 'payment_confirmation'
  | 'order_status_update'
  | 'shipment_tracking'
  | 'custom';

export interface SendNotificationDto {
  channel: NotificationChannel;
  type: NotificationType;
  recipient: string; // email, phone number, or telegram chat ID
  subject?: string; // Required for email
  message: string;
  templateData?: Record<string, any>;
}

export interface NotificationResponse {
  success: boolean;
  data?: {
    id: string;
    status: string;
    channel: NotificationChannel;
    recipient: string;
  };
  error?: {
    code: string;
    message: string;
  };
}
