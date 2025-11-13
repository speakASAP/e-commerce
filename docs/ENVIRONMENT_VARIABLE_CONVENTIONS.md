# Environment Variable Naming Conventions

This document defines the naming conventions for environment variables used across the FlipFlop.cz e-commerce platform.

## General Principles

1. **UPPERCASE**: All environment variable names are in UPPERCASE
2. **SNAKE_CASE**: Use underscores to separate words
3. **Descriptive**: Names should clearly indicate their purpose
4. **Consistent**: Follow established patterns throughout the platform

## Naming Patterns

### Service URLs

#### Internal Services

Pattern: `{SERVICE_NAME}_SERVICE_URL`

Examples:

- `USER_SERVICE_URL`
- `PRODUCT_SERVICE_URL`
- `ORDER_SERVICE_URL`
- `SUPPLIER_SERVICE_URL`
- `AI_SERVICE_URL`
- `ANALYTICS_SERVICE_URL`

#### External Microservices

Pattern: `{SERVICE_NAME}_SERVICE_URL` or `{SERVICE_NAME}_MICROSERVICE_URL`

Examples:

- `NOTIFICATION_SERVICE_URL` (preferred)
- `LOGGING_SERVICE_URL` (preferred)

**Note**: Both patterns are acceptable, but `_SERVICE_URL` is preferred for consistency.

### Database Configuration

Pattern: `DB_{CONFIGURATION}`

Examples:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SYNC`

### Redis Configuration

Pattern: `REDIS_{CONFIGURATION}`

Examples:

- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `REDIS_DB`

### Service Configuration

Pattern: `{SERVICE_NAME}_{CONFIGURATION}`

Examples:

- `PORT` (service port)
- `NODE_ENV` (environment: development/production)
- `SERVICE_NAME` (service identifier)
- `LOG_LEVEL` (logging level)
- `LOG_TIMESTAMP_FORMAT` (timestamp format)

### API Keys and Secrets

Pattern: `{PROVIDER}_{TYPE}`

Examples:

- `JWT_SECRET`
- `PAYU_CLIENT_ID`
- `PAYU_CLIENT_SECRET`
- `SENDGRID_API_KEY`
- `OPENROUTER_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `WHATSAPP_ACCESS_TOKEN`

### Third-Party Service Configuration

Pattern: `{PROVIDER}_{CONFIGURATION}`

Examples:

- `PAYU_MERCHANT_ID`
- `PAYU_POS_ID`
- `PAYU_API_URL`
- `PAYU_SANDBOX`
- `SENDGRID_FROM_EMAIL`
- `SENDGRID_FROM_NAME`
- `OPENROUTER_API_BASE`
- `OPENROUTER_MODEL`
- `OPENROUTER_TIMEOUT`

### Logging Configuration

Pattern: `LOG_{CONFIGURATION}`

Examples:

- `LOG_LEVEL`
- `LOG_TIMESTAMP_FORMAT`
- `LOG_FILE_PATH`
- `LOG_STORAGE_PATH`
- `LOG_ROTATION_MAX_SIZE`
- `LOG_ROTATION_MAX_FILES`
- `LOGGING_SERVICE_URL`

## Service-Specific Variables

### Order Service

- `NOTIFICATION_SERVICE_URL` - Notification microservice URL
- `USER_SERVICE_URL` - User service URL
- `PAYU_*` - All PayU payment gateway variables

### User Service

- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time

### AI Service

- `OPENROUTER_*` - All OpenRouter API variables

### Notification Microservice

- `SENDGRID_*` - SendGrid email service variables
- `TELEGRAM_*` - Telegram Bot API variables
- `WHATSAPP_*` - WhatsApp Business API variables

## Special Cases

### Port Numbers

- `PORT` - Service port (default varies by service)
- `{SERVICE}_PORT` - Specific service port (e.g., `FRONTEND_PORT`)

### URLs

- `API_URL` - API Gateway URL
- `FRONTEND_URL` - Frontend application URL
- `CORS_ORIGIN` - CORS allowed origin

### Network Configuration

- `NGINX_NETWORK_NAME` - Docker network name (default: `nginx-network`)

## Environment-Specific Variables

### Development

- `NODE_ENV=development`
- `DB_SYNC=true` (auto-sync database schema)
- `LOG_LEVEL=debug`

### Production

- `NODE_ENV=production`
- `DB_SYNC=false` (use migrations)
- `LOG_LEVEL=info`
- `CORS_ORIGIN=https://flipflop.cz`

## Variable Groups

### Required for All Services

- `NODE_ENV`
- `PORT`
- `SERVICE_NAME`
- `LOG_LEVEL`
- `LOGGING_SERVICE_URL`

### Database Services

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SYNC`

### Authentication Services

- `JWT_SECRET`
- `JWT_EXPIRES_IN`

### External Service Integration

- `NOTIFICATION_SERVICE_URL`
- `USER_SERVICE_URL`
- `PRODUCT_SERVICE_URL`
- `ORDER_SERVICE_URL`
- etc.

## Best Practices

### ✅ DO

1. **Use descriptive names**: `USER_SERVICE_URL` not `USER_URL`
2. **Follow patterns**: Use established patterns for consistency
3. **Group related variables**: Use prefixes for related configs
4. **Document defaults**: Include default values in documentation
5. **Use ConfigService**: Access via `ConfigService` in NestJS, not `process.env`

### ❌ DON'T

1. **Don't use abbreviations**: `USR_URL` instead of `USER_SERVICE_URL`
2. **Don't mix patterns**: Stick to one naming pattern per variable type
3. **Don't hardcode values**: Always use environment variables
4. **Don't skip documentation**: Document all variables in `ENVIRONMENT_VARIABLES.md`
5. **Don't use lowercase**: Always use UPPERCASE

## Examples

### Good Examples ✅

```env
# Service URLs
USER_SERVICE_URL=http://e-commerce-user-service:3004
NOTIFICATION_SERVICE_URL=http://notification-microservice:3010

# Database
DB_HOST=db-server-postgres
DB_PORT=5432
DB_NAME=ecommerce

# API Keys
JWT_SECRET=your-super-secret-key
SENDGRID_API_KEY=your-sendgrid-key

# Configuration
LOG_LEVEL=info
NODE_ENV=production
```

### Bad Examples ❌

```env
# Too abbreviated
USR_URL=http://user:3004

# Wrong case
user_service_url=http://user:3004

# Inconsistent pattern
NOTIFICATION_MICROSERVICE_URL=http://notification:3010
USER_SERVICE_URL=http://user:3004

# Hardcoded (should be env var)
const url = 'http://user-service:3004';
```

## Migration Guide

If you need to rename variables:

1. Update `.env` files
2. Update `docs/ENVIRONMENT_VARIABLES.md`
3. Update code using `ConfigService.get()`
4. Update deployment scripts
5. Update documentation

## Summary

- **Pattern**: `{CATEGORY}_{SPECIFIC}_{TYPE}`
- **Case**: UPPERCASE
- **Separator**: Underscore (`_`)
- **Consistency**: Follow established patterns
- **Documentation**: Always document in `ENVIRONMENT_VARIABLES.md`

For complete list of all environment variables, see `docs/ENVIRONMENT_VARIABLES.md`.
