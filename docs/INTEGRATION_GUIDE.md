# Integration Guide

This guide explains how to integrate with the FlipFlop.cz e-commerce platform microservices.

## Service Communication

### Internal Service Communication

All services communicate via HTTP REST APIs. Services are accessible through:

1. **Direct access** (within Docker network): `http://service-name:port`
2. **API Gateway** (external access): `http://api-gateway:3001/api/service-path`

### Service URLs

| Service | Internal URL | API Gateway Path |
|---------|-------------|------------------|
| User Service | `http://user-service:3004` | `/api/users`, `/api/auth` |
| Product Service | `http://product-service:3002` | `/api/products`, `/api/categories` |
| Order Service | `http://order-service:3003` | `/api/orders`, `/api/cart`, `/api/payu` |
| Supplier Service | `http://supplier-service:3006` | `/api/suppliers` |
| AI Service | `http://ai-service:3007` | `/api/ai` |
| Analytics Service | `http://analytics-service:3008` | `/api/analytics` |
| Notification Service | `http://notification-microservice:3010` | Direct access |
| Logging Service | `http://logging-microservice:3009` | Direct access |

## Logging Integration

### Using the Logger Utility

All services use the centralized logger utility located at `utils/logger.ts`:

```typescript
import { Logger } from '../../utils/logger';

const logger = new Logger('service-name');

// Log messages
logger.info('Service started', { port: 3000 });
logger.error('Error occurred', { error: error.message });
logger.warn('Warning message', { data: someData });
logger.debug('Debug information', { details: debugInfo });
```

### Logger Configuration

The logger automatically sends logs to the logging microservice. Configure via environment variables:

```env
LOGGING_SERVICE_URL=http://logging-microservice:3009/api/logs
LOG_LEVEL=info
SERVICE_NAME=your-service-name
```

### Fallback Behavior

If the logging service is unavailable, logs are written to local files:

- Location: `./logs/app.log`
- Format: JSON with timestamp, level, message, metadata

## Notification Integration

### Sending Notifications

Send notifications via the notification microservice:

**Recommended Approach (Using NotificationService):**

```typescript
import { NotificationService } from '../../../../shared/notifications/notification.service';

// In your service constructor
constructor(
  private notificationService: NotificationService,
) {}

// Send order confirmation
await this.notificationService.sendOrderConfirmation(
  'customer@example.com',
  'ORD-2025-000001',
  1500.00,
  'email'
);
```

**Alternative Approach (Direct HTTP call):**

```typescript
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// In your service constructor
constructor(
  private httpService: HttpService,
  private configService: ConfigService,
) {}

// Get notification service URL
const notificationServiceUrl = 
  this.configService.get<string>('NOTIFICATION_SERVICE_URL') || 
  'http://notification-microservice:3010';

// Send email notification
await firstValueFrom(
  this.httpService.post(`${notificationServiceUrl}/notifications/send`, {
    channel: 'email',
    type: 'order_confirmation',
    recipient: 'customer@example.com',
    subject: 'Order Confirmation',
    message: 'Your order {{orderNumber}} has been confirmed.',
    templateData: {
      orderNumber: 'ORD-2025-000001'
    }
  })
);

// Send Telegram notification
await firstValueFrom(
  this.httpService.post(`${notificationServiceUrl}/notifications/send`, {
    channel: 'telegram',
    type: 'order_status_update',
    recipient: '123456789', // Telegram chat ID
    message: 'Your order status has been updated to {{status}}.',
    templateData: {
      status: 'Shipped'
    }
  })
);

// Send WhatsApp notification
await firstValueFrom(
  this.httpService.post(`${notificationServiceUrl}/notifications/send`, {
    channel: 'whatsapp',
    type: 'shipment_tracking',
    recipient: '+420123456789',
    message: 'Your shipment tracking number: {{trackingNumber}}',
    templateData: {
      trackingNumber: 'TRACK123456'
    }
  })
);
```

### Notification Types

- `order_confirmation` - Order placed confirmation
- `payment_confirmation` - Payment received confirmation
- `order_status_update` - Order status changed
- `shipment_tracking` - Shipment tracking information
- `custom` - Custom notification

## Authentication Integration

### JWT Token Usage

All protected endpoints require JWT authentication:

```typescript
// Login to get token
const response = await axios.post('http://api-gateway:3001/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

const token = response.data.data.token;

// Use token in subsequent requests
const userProfile = await axios.get('http://api-gateway:3001/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Service-to-Service Authentication

For service-to-service communication, services can validate tokens via the User Service:

```typescript
// In your service
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

async validateToken(token: string) {
  const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3004';
  try {
    const response = await firstValueFrom(
      this.httpService.get(`${userServiceUrl}/users/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    );
    return response.data;
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
}
```

## Database Integration

### Shared Entities

All services use shared TypeORM entities located in `shared/entities/`:

```typescript
import { User } from '../../../shared/entities/user.entity';
import { Product } from '../../../shared/entities/product.entity';
import { Order } from '../../../shared/entities/order.entity';
```

### Database Connection

All services connect to the same PostgreSQL database:

```typescript
// Database configuration
DB_HOST=db-server-postgres
DB_PORT=5432
DB_USER=dbadmin
DB_PASSWORD=your-password
DB_NAME=ecommerce
DB_SYNC=false  // Always false in production
```

## Payment Integration (PayU)

### Creating Payment

```typescript
// In Order Service
const payuService = new PayuService();

const payment = await payuService.createPayment(order, user, deliveryAddress);
// Returns payment URL for redirect
```

### Payment Webhook

PayU sends webhooks to:

```text
POST /api/payu/notify
```

Handle webhook in your Order Service to update payment status.

## Supplier Integration

### Product Synchronization

```typescript
// Manual sync
await axios.post('http://api-gateway:3001/api/suppliers/:supplierId/sync');

// Automatic sync runs hourly for suppliers with autoSyncProducts=true
```

### Supplier API Configuration

Configure supplier APIs in the Supplier Service:

```typescript
{
  "name": "Supplier Name",
  "apiUrl": "https://supplier-api.com",
  "apiKey": "supplier-api-key",
  "autoSyncProducts": true,
  "autoForwardOrders": false
}
```

## AI Assistant Integration

### Chat Interface

```typescript
const response = await axios.post('http://api-gateway:3001/api/ai/chat', {
  message: 'What products do you have?',
  context: {
    userId: 'user-id',
    sessionId: 'session-id'
  }
});

const aiResponse = response.data.data;
```

### Product Recommendations

```typescript
const recommendations = await axios.get(
  `http://api-gateway:3001/api/ai/recommendations/${productId}`
);

const productIds = recommendations.data.data;
```

## Analytics Integration

### Querying Analytics

```typescript
// Sales data
const sales = await axios.get('http://api-gateway:3001/api/analytics/sales', {
  params: {
    startDate: '2025-01-01',
    endDate: '2025-01-31'
  },
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Revenue data
const revenue = await axios.get('http://api-gateway:3001/api/analytics/revenue', {
  params: {
    startDate: '2025-01-01',
    endDate: '2025-01-31'
  },
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Error Handling

### Standard Error Response

All services return errors in a standard format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

### Common Error Codes

- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `VALIDATION_ERROR` - Request validation failed
- `INTERNAL_ERROR` - Server error

## Health Checks

All services provide health check endpoints:

```typescript
// Check service health
const health = await axios.get('http://service-name:port/health');

// Response:
{
  "success": true,
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "service": "service-name"
}
```

## Best Practices

1. **Always use API Gateway** for external requests
2. **Use service names** (not IPs) for internal communication
3. **Handle errors gracefully** with proper error responses
4. **Log important events** using the centralized logger
5. **Send notifications** for user-facing events
6. **Validate input** using DTOs and class-validator
7. **Use transactions** for multi-step operations
8. **Cache frequently accessed data** using Redis
9. **Monitor service health** via health check endpoints
10. **Use environment variables** for configuration

## Testing Integration

### Local Testing

1. Start all services via Docker Compose
2. Use `localhost` URLs for testing
3. Ensure all services are on the same network
4. Check service logs for debugging

### Integration Testing

```typescript
// Example integration test
describe('Order Service Integration', () => {
  it('should create order and send notification', async () => {
    // Create order
    const order = await createOrder(orderData);
    
    // Verify notification sent
    const notifications = await getNotificationHistory();
    expect(notifications).toContainEqual(
      expect.objectContaining({
        type: 'order_confirmation',
        recipient: order.user.email
      })
    );
  });
});
```
