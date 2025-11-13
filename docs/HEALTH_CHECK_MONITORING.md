# Health Check Monitoring Guide

This guide explains the health check system and how to monitor service health in the FlipFlop.cz e-commerce platform.

## Overview

All services provide health check endpoints that return service status and dependency health information. This enables monitoring, load balancing, and automated recovery.

## Health Check Endpoints

### Basic Health Check

All services provide a basic health endpoint:

```bash
GET http://{service}:{port}/health
```

**Example**:

```bash
curl http://localhost:3003/health
```

**Response**:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-01-27T12:00:00.000Z",
    "service": "order-service"
  }
}
```

### Enhanced Health Check (Order Service)

Order service provides enhanced health checks with dependency status:

```bash
GET http://localhost:3003/health
```

**Response**:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-01-27T12:00:00.000Z",
    "service": "order-service",
    "dependencies": {
      "database": {
        "status": "ok"
      },
      "logging": {
        "status": "ok"
      },
      "notification": {
        "status": "ok"
      }
    }
  }
}
```

## Health Status Values

### Status Levels

- **`ok`**: Service is healthy, all critical dependencies are available
- **`degraded`**: Service is operational but some non-critical dependencies are unavailable
- **`unhealthy`**: Service is not operational, critical dependencies are unavailable

### Dependency Status

Each dependency can have:

- **`ok`**: Dependency is available and responding
- **`error`**: Dependency is unavailable or not responding

## Service Health Checks

### All Services

| Service | Port | Health Endpoint | Enhanced Checks |
|---------|------|----------------|-----------------|
| API Gateway | 3001 | `/health` | No |
| Product Service | 3002 | `/health` | No |
| Order Service | 3003 | `/health` | ✅ Yes |
| User Service | 3004 | `/health` | No |
| Supplier Service | 3006 | `/health` | No |
| AI Service | 3007 | `/health` | No |
| Analytics Service | 3008 | `/health` | No |
| Frontend | 3000 | `/health` | No |

### External Services

| Service | Port | Health Endpoint |
|---------|------|----------------|
| Logging Service | 3009 | `/health` |
| Notification Service | 3010 | `/health` |

## Using the Health Check Script

### Basic Usage

```bash
cd e-commerce
./scripts/health-check.sh
```

**Output**:

```text
🏥 Health Check - FlipFlop.cz Platform
==========================================

Main Platform Services:
Checking API Gateway (:3001)... ✅ Healthy
Checking Product Service (:3002)... ✅ Healthy
Checking Order Service (:3003)... ✅ Healthy
...
```

### Checking Specific Service

```bash
curl http://localhost:3003/health | jq .
```

## Health Check Implementation

### Basic Health Check (Simple Services)

```typescript
@Controller('health')
export class HealthController {
  @Get()
  health() {
    return ApiResponseUtil.success({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'service-name',
    });
  }
}
```

### Enhanced Health Check (Order Service)

```typescript
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async health() {
    const healthStatus = await this.healthService.getHealthStatus('order-service');
    return ApiResponseUtil.success(healthStatus);
  }
}
```

## Dependency Checks

### Database Check

Checks PostgreSQL connection:

```typescript
async checkDatabase(): Promise<{ status: 'ok' | 'error'; message?: string }> {
  try {
    await this.connection.query('SELECT 1');
    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
```

**Critical**: Service is `unhealthy` if database check fails.

### Logging Service Check

Checks logging-microservice availability:

```typescript
async checkLoggingService(): Promise<{ status: 'ok' | 'error'; message?: string }> {
  // HTTP GET to logging service health endpoint
  // Timeout: 3 seconds
}
```

**Non-Critical**: Service is `degraded` if logging service is unavailable.

### Notification Service Check

Checks notification-microservice availability (order-service only):

```typescript
async checkNotificationService(): Promise<{ status: 'ok' | 'error'; message?: string }> {
  // HTTP GET to notification service health endpoint
  // Timeout: 3 seconds
}
```

**Non-Critical**: Service is `degraded` if notification service is unavailable.

## Graceful Degradation

### Design Principles

1. **Critical Dependencies**: Service is `unhealthy` if critical dependencies fail
   - Database: Critical (service cannot function)
   - Redis: Non-critical (caching only)

2. **Non-Critical Dependencies**: Service is `degraded` if non-critical dependencies fail
   - Logging Service: Non-critical (falls back to local logging)
   - Notification Service: Non-critical (notifications fail but order processing continues)

3. **Fallback Behavior**: Services continue operating with reduced functionality

### Example: Order Service

**Scenario 1: Database Unavailable**

- Status: `unhealthy`
- Behavior: Service cannot process orders
- Action: Alert operators, check database

**Scenario 2: Notification Service Unavailable**

- Status: `degraded`
- Behavior: Orders process normally, but emails not sent
- Action: Log warning, continue processing

**Scenario 3: Logging Service Unavailable**

- Status: `degraded`
- Behavior: Logs written to local files
- Action: Log warning, continue processing

## Monitoring Integration

### Docker Health Checks

Docker Compose health checks use the health endpoints:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3003/health"]
  interval: 30s
  timeout: 10s
  retries: 5
```

### Load Balancer Integration

Health endpoints can be used for load balancer health checks:

```nginx
upstream order-service {
    server e-commerce-order-service:3003;
}

server {
    location /health {
        proxy_pass http://order-service/health;
    }
}
```

### Monitoring Tools

#### Prometheus

Scrape health endpoints:

```yaml
scrape_configs:
  - job_name: 'e-commerce-services'
    static_configs:
      - targets: ['e-commerce-api-gateway:3001', 'e-commerce-order-service:3003']
    metrics_path: '/health'
```

#### Custom Monitoring Script

```bash
#!/bin/bash
# monitor-health.sh

SERVICES=(
  "api-gateway:3001"
  "order-service:3003"
  "user-service:3004"
)

for service in "${SERVICES[@]}"; do
  name=$(echo $service | cut -d: -f1)
  port=$(echo $service | cut -d: -f2)
  
  status=$(curl -s http://localhost:$port/health | jq -r '.data.status')
  
  if [ "$status" != "ok" ]; then
    echo "ALERT: $name is $status"
    # Send alert (email, Slack, etc.)
  fi
done
```

## Automated Recovery

### Docker Restart Policy

Services use `restart: unless-stopped`:

```yaml
services:
  order-service:
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3003/health"]
      interval: 30s
      timeout: 10s
      retries: 5
```

Docker will restart containers if health checks fail.

### Service-Level Recovery

Services implement graceful degradation:

- Continue operating with reduced functionality
- Log errors for monitoring
- Retry failed operations where appropriate

## Health Check Best Practices

### ✅ DO

1. **Check critical dependencies**: Database, required services
2. **Use timeouts**: Prevent hanging health checks
3. **Return quickly**: Health checks should be fast (< 1 second)
4. **Include timestamps**: Help with debugging
5. **Log health check failures**: For monitoring

### ❌ DON'T

1. **Don't check non-essential dependencies**: Keep checks fast
2. **Don't throw errors**: Return status, don't crash
3. **Don't block**: Health checks should be non-blocking
4. **Don't expose sensitive data**: Keep responses minimal

## Troubleshooting

### Health Check Returns Unhealthy

1. **Check service logs**:

```bash
docker-compose logs order-service
```

2. **Check dependencies**:

```bash
# Database
docker exec -it db-server-postgres psql -U dbadmin -d ecommerce -c "SELECT 1"

# Logging service
curl http://logging-microservice:3009/health

# Notification service
curl http://notification-microservice:3010/health
```

3. **Check network connectivity**:

```bash
docker network inspect nginx-network
```

### Health Check Timeout

1. **Increase timeout** (if needed):

```typescript
timeout(5000) // 5 seconds instead of 3
```

2. **Check service response time**:

```bash
time curl http://localhost:3003/health
```

3. **Check resource usage**:

```bash
docker stats e-commerce-order-service
```

## Summary

- **All services** provide `/health` endpoints
- **Order service** includes enhanced dependency checks
- **Status levels**: `ok`, `degraded`, `unhealthy`
- **Graceful degradation**: Services continue with reduced functionality
- **Monitoring**: Use health endpoints for monitoring and alerting
- **Automated recovery**: Docker handles container restarts

For service discovery details, see [SERVICE_DISCOVERY.md](SERVICE_DISCOVERY.md).
