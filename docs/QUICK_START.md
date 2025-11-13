# Quick Start Guide

Get the FlipFlop.cz e-commerce platform up and running quickly.

## Prerequisites

- Docker and Docker Compose installed
- Git installed
- PostgreSQL database server (external, accessible via `db-server-postgres`)
- Nginx server with SSL (external, in `../nginx-microservice`)
- Redis server (optional, for caching)

## Quick Setup

### 1. Clone Repositories

```bash
# Main platform
git clone git@github.com:speakASAP/e-commerce.git
cd e-commerce

# Notification microservice
cd ..
git clone git@github.com:speakASAP/notification-microservice.git

# Logging microservice
git clone git@github.com:speakASAP/logging-microservice.git
```

### 2. Configure Environment Variables

Create `.env` files in each project:

```bash
# Main platform
cd e-commerce
cp .env.example .env
# Edit .env with your configuration

# Notification service
cd ../notification-microservice
cp .env.example .env
# Edit .env with SendGrid, Telegram, WhatsApp credentials

# Logging service
cd ../logging-microservice
cp .env.example .env
# Edit .env (minimal configuration needed)
```

See `docs/ENVIRONMENT_VARIABLES.md` for all required variables.

### 3. Create Docker Network

```bash
docker network create nginx-network
```

### 4. Start All Services

```bash
cd e-commerce
./scripts/start-all.sh
```

This will:

- Start logging service
- Start notification service
- Start all main platform services
- Perform health checks

### 5. Verify Services

```bash
# Check health
./scripts/health-check.sh

# View logs
./scripts/view-logs.sh all --follow
```

## Service URLs

Once started, services are available at:

- **API Gateway**: <http://localhost:3001>
- **Frontend**: <http://localhost:3000> (when implemented)
- **User Service**: <http://localhost:3004>
- **Product Service**: <http://localhost:3002>
- **Order Service**: <http://localhost:3003>
- **Supplier Service**: <http://localhost:3006>
- **AI Service**: <http://localhost:3007>
- **Analytics Service**: <http://localhost:3008>
- **Logging Service**: <http://localhost:3009>
- **Notification Service**: <http://localhost:3010>

## Testing the API

### Register a User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response.

### Get Products

```bash
curl http://localhost:3001/api/products
```

### Get User Profile (with token)

```bash
curl http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Commands

### Start Services

```bash
./scripts/start-all.sh
```

### Stop Services

```bash
./scripts/stop-all.sh
```

### Restart a Service

```bash
./scripts/restart-service.sh order-service
```

### View Logs

```bash
# All services
./scripts/view-logs.sh all --follow

# Specific service
./scripts/view-logs.sh order-service --follow
```

### Health Check

```bash
./scripts/health-check.sh
```

## Troubleshooting

### Services Won't Start

1. Check Docker is running: `docker info`
2. Check network exists: `docker network inspect nginx-network`
3. Check logs: `./scripts/view-logs.sh [service-name]`
4. Verify environment variables are set correctly

### Database Connection Issues

1. Verify PostgreSQL is accessible: `psql -h db-server-postgres -U dbadmin -d ecommerce`
2. Check database credentials in `.env`
3. Ensure database exists: `CREATE DATABASE ecommerce;`

### Service Health Check Fails

1. Wait a few seconds after starting (services need time to initialize)
2. Check service logs: `./scripts/view-logs.sh [service-name]`
3. Restart the service: `./scripts/restart-service.sh [service-name]`

### Port Already in Use

If a port is already in use:

1. Find the process: `lsof -i :3001`
2. Stop the conflicting service
3. Or change the port in `.env` and `docker-compose.yml`

## Next Steps

1. **Set up database migrations**: Run TypeORM migrations
2. **Configure payment gateway**: Set up PayU credentials
3. **Configure notifications**: Set up SendGrid, Telegram, WhatsApp
4. **Set up SSL**: Configure Nginx with Let's Encrypt certificates
5. **Deploy frontend**: Implement Next.js frontend
6. **Production deployment**: Follow `docs/DEPLOYMENT_GUIDE.md`

## Development Workflow

1. Make code changes
2. Rebuild service: `docker-compose build [service-name]`
3. Restart service: `./scripts/restart-service.sh [service-name]`
4. View logs: `./scripts/view-logs.sh [service-name] --follow`
5. Test changes via API or frontend

## Getting Help

- Check `docs/INTEGRATION_GUIDE.md` for integration patterns
- Check `docs/DEPLOYMENT_GUIDE.md` for deployment help
- Check service logs for error messages
- Review `docs/ENVIRONMENT_VARIABLES.md` for configuration

## Production Checklist

Before deploying to production:

- [ ] All environment variables are set
- [ ] Database is backed up
- [ ] SSL certificates are configured
- [ ] Payment gateway is configured (not sandbox)
- [ ] Notification services are configured
- [ ] Logging is working
- [ ] Health checks are passing
- [ ] All services are on the same network
- [ ] Firewall rules are configured
- [ ] Monitoring is set up

See `docs/DEPLOYMENT_GUIDE.md` for detailed production deployment instructions.
