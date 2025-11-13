# Services Setup Guide

## Overview

All microservices follow a similar structure and setup pattern. This document describes the common setup and service-specific configurations.

## Common Structure

Each service has:

- `src/` - Source code
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `nest-cli.json` - NestJS CLI configuration
- `Dockerfile` - Container build instructions
- `.env` - Environment variables (not in git)

## Service Ports

- **API Gateway**: 3001
- **Product Service**: 3002
- **Order Service**: 3003
- **User Service**: 3004
- **Supplier Service**: 3006
- **AI Service**: 3007
- **Analytics Service**: 3008

## Shared Modules

All services use:

- `@shared/database` - Database connection (TypeORM)
- `@shared/logger` - Centralized logging
- `@shared/redis` - Redis client (if needed)
- `@shared/utils` - Common utilities

## Setup Steps

1. **Initialize NestJS project structure**
2. **Install dependencies**: `npm install`
3. **Configure environment variables** in `.env`
4. **Build**: `npm run build`
5. **Run**: `npm run start:dev` (development) or `npm run start:prod` (production)

## Service-Specific Notes

### API Gateway

- Routes requests to other microservices
- Handles authentication/authorization
- Rate limiting
- Request/response logging

### User Service

- User registration and authentication
- JWT token generation
- User profile management
- Delivery address management

### Product Service

- Product CRUD operations
- Category management
- Product search and filtering
- Inventory tracking

### Order Service

- Cart management
- Checkout process
- PayU payment integration
- Order creation and tracking
- Invoice generation

### Supplier Service

- Supplier API integration
- Product synchronization
- Order forwarding

### AI Service

- OpenRouter API integration
- AI shopping assistant
- Product recommendations

### Analytics Service

- Sales analytics
- Profit/margin calculations
- Performance metrics

## Docker Build

Each service has a Dockerfile that:

1. Builds the TypeScript code
2. Copies shared modules
3. Installs production dependencies
4. Exposes the service port

Build command:

```bash
docker build -t e-commerce-<service-name> ./services/<service-name>
```

## Environment Variables

Each service needs:

- `PORT` - Service port
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database connection
- `LOGGING_SERVICE_URL` - Logging microservice URL
- Service-specific variables (see service documentation)
