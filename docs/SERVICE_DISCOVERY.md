# Service Discovery Reference

This document provides a complete reference for service discovery in the FlipFlop.cz e-commerce platform microservices architecture.

## Docker Network

All services communicate via the `nginx-network` Docker network. Services discover each other using Docker DNS by container name.

**Network Name**: `nginx-network`  
**Type**: External network (created by nginx-microservice)

## Container Names and Service Discovery

### Main E-commerce Platform Services

| Service | Container Name | Port | Internal URL | Purpose |
|---------|---------------|------|--------------|---------|
| Frontend | `e-commerce-frontend` | 3000 | `http://e-commerce-frontend:3000` | Next.js frontend application |
| API Gateway | `e-commerce-api-gateway` | 3001 | `http://e-commerce-api-gateway:3001` | Request routing and authentication |
| Product Service | `e-commerce-product-service` | 3002 | `http://e-commerce-product-service:3002` | Product management |
| Order Service | `e-commerce-order-service` | 3003 | `http://e-commerce-order-service:3003` | Order processing and cart |
| User Service | `e-commerce-user-service` | 3004 | `http://e-commerce-user-service:3004` | User authentication and profiles |
| Supplier Service | `e-commerce-supplier-service` | 3006 | `http://e-commerce-supplier-service:3006` | Supplier integration |
| AI Service | `e-commerce-ai-service` | 3007 | `http://e-commerce-ai-service:3007` | AI shopping assistant |
| Analytics Service | `e-commerce-analytics-service` | 3008 | `http://e-commerce-analytics-service:3008` | Analytics and reporting |

### External Microservices

| Service | Container Name | Port | Internal URL | Purpose |
|---------|---------------|------|--------------|---------|
| Notification Service | `notification-microservice` | 3010 | `http://notification-microservice:3010` | Multi-channel notifications |
| Logging Service | `logging-microservice` | 3009 | `http://logging-microservice:3009` | Centralized logging |

### Infrastructure Services

| Service | Container Name | Port | Internal URL | Purpose |
|---------|---------------|------|--------------|---------|
| PostgreSQL Database | `db-server-postgres` | 5432 | `db-server-postgres:5432` | Primary database |
| Redis Cache | `db-server-redis` | 6379 | `db-server-redis:6379` | Caching layer |
| Nginx | `nginx` (in nginx-microservice) | 80/443 | N/A | Reverse proxy and SSL |

## Service Communication Patterns

### 1. Direct Service-to-Service Communication

Services communicate directly using container names:

```typescript
// Example: Order Service calling User Service
const userServiceUrl = 'http://e-commerce-user-service:3004';
const response = await httpService.get(`${userServiceUrl}/users/${userId}`);
```

### 2. Using Environment Variables

**Best Practice**: Use environment variables with ConfigService:

```typescript
import { ConfigService } from '@nestjs/config';

constructor(private configService: ConfigService) {}

const userServiceUrl = 
  this.configService.get<string>('USER_SERVICE_URL') || 
  'http://e-commerce-user-service:3004';
```

### 3. Via API Gateway (External Access)

External clients should use the API Gateway:

```text
External: https://flipflop.cz/api/orders
Internal: http://e-commerce-api-gateway:3001/api/orders
```

## Environment Variables for Service URLs

### Standard Pattern

All service URLs follow this pattern:

- `{SERVICE_NAME}_SERVICE_URL` for internal services
- `{SERVICE_NAME}_MICROSERVICE_URL` for external microservices

### Required Environment Variables

```env
# Internal Services
USER_SERVICE_URL=http://e-commerce-user-service:3004
PRODUCT_SERVICE_URL=http://e-commerce-product-service:3002
ORDER_SERVICE_URL=http://e-commerce-order-service:3003
SUPPLIER_SERVICE_URL=http://e-commerce-supplier-service:3006
AI_SERVICE_URL=http://e-commerce-ai-service:3007
ANALYTICS_SERVICE_URL=http://e-commerce-analytics-service:3008

# External Microservices
NOTIFICATION_SERVICE_URL=http://notification-microservice:3010
LOGGING_SERVICE_URL=http://logging-microservice:3009

# Database Services
DB_HOST=db-server-postgres
REDIS_HOST=db-server-redis
```

## Network Requirements

### All Services Must

1. **Be on nginx-network**: All containers must be connected to `nginx-network`
2. **Use container names**: Docker DNS resolves container names automatically
3. **Expose ports internally**: Ports must be accessible within the Docker network
4. **Use environment variables**: Never hardcode service URLs

### Docker Compose Configuration

```yaml
services:
  my-service:
    container_name: e-commerce-my-service
    networks:
      - default
      - nginx-network
    # ... other config

networks:
  nginx-network:
    external: true
    name: nginx-network
```

## Service Discovery Best Practices

### ✅ DO

- Use environment variables with ConfigService
- Use container names for service discovery
- Provide fallback URLs in code
- Document all service URLs
- Use consistent naming conventions

### ❌ DON'T

- Hardcode service URLs
- Use IP addresses
- Use `localhost` for inter-service communication
- Mix service names and container names
- Skip environment variable configuration

## Health Checks

All services provide health check endpoints:

```typescript
// Health check endpoint
GET http://{container-name}:{port}/health

// Example
GET http://e-commerce-order-service:3003/health
```

## Troubleshooting

### Service Not Found

**Problem**: Service cannot be reached

**Solutions**:

1. Verify container is running: `docker ps | grep container-name`
2. Check network connection: `docker network inspect nginx-network`
3. Verify container is on network: `docker network connect nginx-network container-name`
4. Check container name matches exactly (case-sensitive)
5. Verify port is exposed internally

### DNS Resolution Issues

**Problem**: Container name doesn't resolve

**Solutions**:

1. Ensure container name matches exactly
2. Verify both containers are on same network
3. Check Docker network configuration
4. Restart containers if needed

### Connection Timeout

**Problem**: Connection to service times out

**Solutions**:

1. Verify service is listening on correct port
2. Check firewall/security group settings
3. Verify health check endpoint responds
4. Check service logs for errors

## Service Dependencies

### Order Service Dependencies

- User Service (for user data)
- Product Service (for product data)
- Notification Service (for notifications)
- Logging Service (for logging)
- Database (PostgreSQL)

### User Service Dependencies

- Database (PostgreSQL)
- Logging Service (for logging)

### Product Service Dependencies

- Database (PostgreSQL)
- Logging Service (for logging)

### API Gateway Dependencies

- All internal services (for routing)
- User Service (for authentication)

## External Access

External clients access services through:

- **Domain**: `https://flipflop.cz`
- **API Gateway**: `https://flipflop.cz/api/*`
- **Frontend**: `https://flipflop.cz/*`

Nginx handles SSL termination and routes to appropriate services.

## Summary

- **Network**: `nginx-network` (external Docker network)
- **Discovery**: Docker DNS by container name
- **Configuration**: Environment variables with ConfigService
- **Pattern**: `http://{container-name}:{port}`
- **Best Practice**: Always use environment variables, never hardcode URLs

For detailed environment variable configuration, see `docs/ENVIRONMENT_VARIABLES.md`.
