# External Services Deployment Guide

This guide covers deploying and managing the external microservices (notification-microservice and logging-microservice) that are separate from the main e-commerce platform.

## Overview

The FlipFlop.cz platform uses two external microservices:

1. **Notification Microservice** (`../notification-microservice`) - Port 3010
2. **Logging Microservice** (`../logging-microservice`) - Port 3009

These services are deployed separately but must be on the same Docker network (`nginx-network`) to communicate with the main platform.

## Prerequisites

- Docker and Docker Compose installed
- Access to `../notification-microservice` directory
- Access to `../logging-microservice` directory
- `nginx-network` Docker network exists (created by nginx-microservice)

## Network Setup

### Verify Network Exists

```bash
docker network inspect nginx-network
```

If network doesn't exist, create it:

```bash
docker network create nginx-network
```

Or it will be created automatically by nginx-microservice.

## Notification Microservice Deployment

### Location

`../notification-microservice` (relative to e-commerce project)

### Repository

`git@github.com:speakASAP/notification-microservice.git`

### Deployment Steps

1. **Navigate to directory**:

```bash
cd ../notification-microservice
```

2. **Clone repository** (if not already cloned):

```bash
git clone git@github.com:speakASAP/notification-microservice.git .
```

3. **Create environment file**:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Configure environment variables**:

```env
PORT=3010
NODE_ENV=production
CORS_ORIGIN=*

# SendGrid Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@flipflop.cz
SENDGRID_FROM_NAME=FlipFlop.cz

# Telegram Configuration (optional)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# WhatsApp Configuration (optional)
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-access-token
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
```

5. **Build and start**:

```bash
docker-compose build
docker-compose up -d
```

6. **Verify deployment**:

```bash
# Check container is running
docker ps | grep notification-microservice

# Check health
curl http://localhost:3010/health

# Check logs
docker-compose logs -f notification-service
```

### Container Details

- **Container Name**: `notification-microservice`
- **Port**: 3010
- **Network**: `nginx-network`
- **Health Endpoint**: `http://notification-microservice:3010/health`

## Logging Microservice Deployment

### Location

`../logging-microservice` (relative to e-commerce project)

### Repository

`git@github.com:speakASAP/logging-microservice.git`

### Deployment Steps

1. **Navigate to directory**:

```bash
cd ../logging-microservice
```

2. **Clone repository** (if not already cloned):

```bash
git clone git@github.com:speakASAP/logging-microservice.git .
```

3. **Create environment file**:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Configure environment variables**:

```env
PORT=3009
NODE_ENV=production
CORS_ORIGIN=*
LOG_LEVEL=info
LOG_STORAGE_PATH=./logs
LOG_ROTATION_MAX_SIZE=100m
LOG_ROTATION_MAX_FILES=10
```

5. **Build and start**:

```bash
docker-compose build
docker-compose up -d
```

6. **Verify deployment**:

```bash
# Check container is running
docker ps | grep logging-microservice

# Check health
curl http://localhost:3009/health

# Check logs
docker-compose logs -f logging-service
```

### Container Details

- **Container Name**: `logging-microservice`
- **Port**: 3009
- **Network**: `nginx-network`
- **Health Endpoint**: `http://logging-microservice:3009/health`
- **Log Storage**: `./logs` directory (mounted as volume)

## Deployment Coordination

### Starting All Services

The main platform's `start-all.sh` script handles starting external services:

```bash
cd e-commerce
./scripts/start-all.sh
```

This script:

1. Checks/creates `nginx-network`
2. Starts logging-microservice first
3. Starts notification-microservice
4. Starts main platform services

### Manual Deployment Order

If deploying manually, follow this order:

1. **Start infrastructure**:
   - Database server (if not already running)
   - Nginx microservice (if not already running)

2. **Start external microservices**:
   - Logging microservice (other services depend on it)
   - Notification microservice

3. **Start main platform**:
   - All e-commerce services

### Stopping Services

Use the main platform's stop script:

```bash
cd e-commerce
./scripts/stop-all.sh
```

Or stop individually:

```bash
# Stop notification service
cd ../notification-microservice
docker-compose down

# Stop logging service
cd ../logging-microservice
docker-compose down
```

## Blue/Green Deployment for External Services

### Current Status

The nginx-microservice includes blue/green deployment scripts, but external services (notification, logging) are not currently included in the blue/green strategy.

### Recommended Approach

For external services, use standard rolling updates:

1. **Build new version**:

```bash
cd ../notification-microservice
docker-compose build notification-service
```

2. **Update with zero downtime**:

```bash
# Start new container
docker-compose up -d --no-deps notification-service

# Old container stops automatically
# Health checks ensure new container is ready
```

3. **Rollback if needed**:

```bash
# Stop new container
docker-compose stop notification-service

# Start previous version
docker-compose up -d notification-service:previous-tag
```

### Future Enhancement

Consider implementing blue/green deployment for external services using similar patterns as nginx-microservice:

1. Create `docker-compose.blue.yml` and `docker-compose.green.yml`
2. Use service registry for traffic switching
3. Implement health check monitoring
4. Add rollback capabilities

## Health Monitoring

### Health Check Endpoints

Both external services provide health endpoints:

```bash
# Notification service
curl http://notification-microservice:3010/health

# Logging service
curl http://logging-microservice:3009/health
```

### Monitoring Script

Use the main platform's health check script:

```bash
cd e-commerce
./scripts/health-check.sh
```

This checks all services including external ones.

### Health Check Response Format

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-01-27T12:00:00.000Z",
    "service": "notification-microservice"
  }
}
```

## Troubleshooting

### Service Not Accessible

**Problem**: Main platform cannot reach external services

**Solutions**:

1. Verify both services are on `nginx-network`:

   ```bash
   docker network inspect nginx-network
   ```

2. Check container names match exactly:
   - `notification-microservice` (not `notification-service`)
   - `logging-microservice` (not `logging-service`)

3. Verify ports are correct:
   - Notification: 3010
   - Logging: 3009

4. Test connectivity:

   ```bash
   docker run --rm --network nginx-network alpine/curl:latest \
     curl http://notification-microservice:3010/health
   ```

### Service Startup Issues

**Problem**: External service fails to start

**Solutions**:

1. Check environment variables are set correctly
2. Verify network exists: `docker network ls | grep nginx-network`
3. Check port conflicts: `netstat -tuln | grep 3010`
4. Review logs: `docker-compose logs notification-service`

### Network Issues

**Problem**: Services can't communicate

**Solutions**:

1. Connect container to network:

   ```bash
   docker network connect nginx-network notification-microservice
   ```

2. Restart containers:

   ```bash
   docker-compose restart
   ```

3. Recreate network (last resort):

   ```bash
   docker network rm nginx-network
   docker network create nginx-network
   # Restart all services
   ```

## Production Considerations

### High Availability

- Run multiple instances of external services if needed
- Use load balancer for notification service (if high volume)
- Implement service discovery for multiple instances

### Backup and Recovery

- **Logging Service**: Logs stored in `./logs` directory (backup regularly)
- **Notification Service**: No persistent data (stateless)

### Scaling

- **Notification Service**: Can scale horizontally (stateless)
- **Logging Service**: Consider centralized log storage for multiple instances

### Security

- Use environment variables for all secrets
- Never commit `.env` files
- Use Docker secrets in production
- Implement rate limiting on notification endpoints

## Integration with Main Platform

### Environment Variables

Main platform services need these variables:

```env
# In e-commerce/.env
NOTIFICATION_SERVICE_URL=http://notification-microservice:3010
LOGGING_SERVICE_URL=http://logging-microservice:3009/api/logs
```

### Service Discovery

Services discover each other via Docker DNS using container names:

- `notification-microservice` (not IP address)
- `logging-microservice` (not IP address)

### Communication Flow

```text
Order Service
    │
    ├── HTTP POST → notification-microservice:3010/notifications/send
    └── HTTP POST → logging-microservice:3009/api/logs
```

## Maintenance

### Updating External Services

1. **Pull latest code**:

```bash
cd ../notification-microservice
git pull origin main
```

2. **Rebuild and restart**:

```bash
docker-compose build
docker-compose up -d
```

3. **Verify**:

```bash
curl http://localhost:3010/health
```

### Log Rotation

Logging service handles log rotation automatically. Monitor disk space:

```bash
cd ../logging-microservice
du -sh logs/
```

### Monitoring

Set up monitoring for:

- Service uptime
- Response times
- Error rates
- Resource usage (CPU, memory, disk)

## Summary

- **Notification Service**: Deploy in `../notification-microservice`
- **Logging Service**: Deploy in `../logging-microservice`
- **Network**: Both must be on `nginx-network`
- **Container Names**: Must match exactly (`notification-microservice`, `logging-microservice`)
- **Health Checks**: Available at `/health` endpoint
- **Deployment**: Use `start-all.sh` from main platform or deploy manually

For detailed configuration, see:

- [Environment Variables](ENVIRONMENT_VARIABLES.md)
- [Service Discovery](SERVICE_DISCOVERY.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
