# Environment Variables Configuration

This document describes all environment variables required for the FlipFlop.cz e-commerce platform and its microservices.

## Main E-commerce Platform

### API Gateway (Port 3001)

```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://flipflop.cz

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Service URLs
USER_SERVICE_URL=http://user-service:3004
PRODUCT_SERVICE_URL=http://product-service:3002
ORDER_SERVICE_URL=http://order-service:3003
SUPPLIER_SERVICE_URL=http://supplier-service:3006
AI_SERVICE_URL=http://ai-service:3007
ANALYTICS_SERVICE_URL=http://analytics-service:3008
NOTIFICATION_SERVICE_URL=http://notification-microservice:3010
LOGGING_SERVICE_URL=http://logging-microservice:3009
```

### User Service (Port 3004)

```env
PORT=3004
NODE_ENV=production

# Database
DB_HOST=db-server-postgres
DB_PORT=5432
DB_USER=dbadmin
DB_PASSWORD=your-database-password
DB_NAME=ecommerce
DB_SYNC=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
LOG_TIMESTAMP_FORMAT=YYYY-MM-DD HH:mm:ss
LOG_FILE_PATH=./logs/app.log
SERVICE_NAME=user-service
LOGGING_SERVICE_URL=http://logging-microservice:3009/api/logs
```

### Product Service (Port 3002)

```env
PORT=3002
NODE_ENV=production

# Database
DB_HOST=db-server-postgres
DB_PORT=5432
DB_USER=dbadmin
DB_PASSWORD=your-database-password
DB_NAME=ecommerce
DB_SYNC=false

# Logging
LOG_LEVEL=info
SERVICE_NAME=product-service
LOGGING_SERVICE_URL=http://logging-microservice:3009/api/logs
```

### Order Service (Port 3003)

```env
PORT=3003
NODE_ENV=production

# Database
DB_HOST=db-server-postgres
DB_PORT=5432
DB_USER=dbadmin
DB_PASSWORD=your-database-password
DB_NAME=ecommerce
DB_SYNC=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# PayU Configuration
PAYU_MERCHANT_ID=your-payu-merchant-id
PAYU_POS_ID=your-payu-pos-id
PAYU_CLIENT_ID=your-payu-client-id
PAYU_CLIENT_SECRET=your-payu-client-secret
PAYU_API_URL=https://secure.payu.com/api/v2_1
PAYU_SANDBOX=false

# URLs
API_URL=http://api-gateway:3001
FRONTEND_URL=https://flipflop.cz
USER_SERVICE_URL=http://user-service:3004
NOTIFICATION_SERVICE_URL=http://notification-microservice:3010

# Logging
LOG_LEVEL=info
SERVICE_NAME=order-service
LOGGING_SERVICE_URL=http://logging-microservice:3009/api/logs
```

### Supplier Service (Port 3006)

```env
PORT=3006
NODE_ENV=production

# Database
DB_HOST=db-server-postgres
DB_PORT=5432
DB_USER=dbadmin
DB_PASSWORD=your-database-password
DB_NAME=ecommerce
DB_SYNC=false

# Logging
LOG_LEVEL=info
SERVICE_NAME=supplier-service
LOGGING_SERVICE_URL=http://logging-microservice:3009/api/logs
```

### AI Service (Port 3007)

```env
PORT=3007
NODE_ENV=production

# OpenRouter API Configuration
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
OPENROUTER_TIMEOUT=60

# URLs
FRONTEND_URL=https://flipflop.cz

# Logging
LOG_LEVEL=info
SERVICE_NAME=ai-service
LOGGING_SERVICE_URL=http://logging-microservice:3009/api/logs
```

### Analytics Service (Port 3008)

```env
PORT=3008
NODE_ENV=production

# Database
DB_HOST=db-server-postgres
DB_PORT=5432
DB_USER=dbadmin
DB_PASSWORD=your-database-password
DB_NAME=ecommerce
DB_SYNC=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Service URLs
USER_SERVICE_URL=http://user-service:3004

# Logging
LOG_LEVEL=info
SERVICE_NAME=analytics-service
LOGGING_SERVICE_URL=http://logging-microservice:3009/api/logs
```

## Notification Microservice (Port 3010)

```env
PORT=3010
NODE_ENV=production
CORS_ORIGIN=*

# SendGrid Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@flipflop.cz
SENDGRID_FROM_NAME=FlipFlop.cz

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# WhatsApp Configuration
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
```

## Logging Microservice (Port 3009)

```env
PORT=3009
NODE_ENV=production
CORS_ORIGIN=*

# Logging Configuration
LOG_LEVEL=info
LOG_STORAGE_PATH=./logs
LOG_ROTATION_MAX_SIZE=100m
LOG_ROTATION_MAX_FILES=10
```

## Redis Configuration (Shared)

```env
REDIS_HOST=redis-server
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0
```

## Frontend (Next.js - Port 3000)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_PAYU_POS_ID=your-payu-pos-id
```

## Security Notes

1. **JWT_SECRET**: Must be a strong, random string. Generate using:

   ```bash
   openssl rand -base64 32
   ```

2. **Database Passwords**: Use strong passwords for production.

3. **API Keys**: Never commit API keys to version control. Use environment variables or secrets management.

4. **PayU Configuration**:
   - Use sandbox credentials for development
   - Use production credentials for production
   - Keep `PAYU_SANDBOX=true` for testing

5. **CORS_ORIGIN**: In production, set to your actual domain:

   ```env
   CORS_ORIGIN=https://flipflop.cz
   ```

## Environment Files Structure

```text
e-commerce/
├── .env                    # Main platform environment
├── services/
│   ├── api-gateway/.env
│   ├── user-service/.env
│   ├── product-service/.env
│   ├── order-service/.env
│   ├── supplier-service/.env
│   ├── ai-service/.env
│   └── analytics-service/.env
notification-microservice/
└── .env
logging-microservice/
└── .env
```

## Quick Setup

1. Copy environment variables from this document
2. Create `.env` files in each service directory
3. Update values with your actual credentials
4. Ensure all services can reach each other via Docker network
5. Test connectivity between services

## Production Checklist

- [ ] All JWT secrets are unique and strong
- [ ] Database passwords are strong
- [ ] API keys are valid and have proper permissions
- [ ] CORS origins are restricted to actual domains
- [ ] PayU is configured for production (not sandbox)
- [ ] Logging is configured appropriately
- [ ] All services are on the same Docker network
- [ ] SSL certificates are configured in Nginx
- [ ] Environment variables are not committed to Git
