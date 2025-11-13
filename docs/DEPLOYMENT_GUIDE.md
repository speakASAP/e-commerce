# Deployment Guide

This guide covers deploying the FlipFlop.cz e-commerce platform to production.

## Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database server (external)
- Nginx server with SSL certificates (external)
- Redis server (optional, for caching)
- Domain name configured
- SSL certificates (Let's Encrypt via Certbot)

## Architecture Overview

```text
┌─────────────────────────────────────────┐
│         Nginx (Reverse Proxy)           │
│         SSL Termination                 │
│         Port 80, 443                    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         API Gateway (Port 3001)        │
└───────┬───────────┬───────────┬─────────┘
        │           │           │
        ▼           ▼           ▼
    ┌──────┐   ┌────────┐  ┌──────┐
    │User  │   │Product │  │Order │
    │ 3004 │   │  3002  │  │ 3003 │
    └──────┘   └────────┘  └──────┘
        │           │           │
        └───────────┴───────────┘
                   │
                   ▼
        ┌──────────────────┐
        │  PostgreSQL DB   │
        │  (External)       │
        └──────────────────┘
```

## Deployment Steps

### 1. Prepare Environment Variables

Create `.env` files for each service based on `ENVIRONMENT_VARIABLES.md`:

```bash
# Main platform
cd e-commerce
cp .env.example .env
# Edit .env with production values

# Notification service
cd ../notification-microservice
cp .env.example .env
# Edit .env with production values

# Logging service
cd ../logging-microservice
cp .env.example .env
# Edit .env with production values
```

### 2. Build Docker Images

```bash
# Main platform services
cd e-commerce
docker-compose build

# Notification service
cd ../notification-microservice
docker-compose build

# Logging service
cd ../logging-microservice
docker-compose build
```

### 3. Database Setup

Ensure PostgreSQL database is running and accessible:

```bash
# Connect to database
psql -h db-server-postgres -U dbadmin -d ecommerce

# Run migrations
# Migrations are in shared/migrations/
# TypeORM will handle migrations if DB_SYNC=false
```

### 4. Start Services

```bash
# Start main platform
cd e-commerce
docker-compose up -d

# Start notification service
cd ../notification-microservice
docker-compose up -d

# Start logging service
cd ../logging-microservice
docker-compose up -d
```

### 5. Verify Services

Check all services are running:

```bash
# Check main platform services
docker-compose ps

# Check notification service
cd ../notification-microservice
docker-compose ps

# Check logging service
cd ../logging-microservice
docker-compose ps

# Test health endpoints
curl http://localhost:3001/health
curl http://localhost:3010/health
curl http://localhost:3009/health
```

### 6. Nginx Configuration

Configure Nginx to route traffic to API Gateway:

```nginx
# /etc/nginx/sites-available/flipflop.cz
server {
    listen 80;
    server_name flipflop.cz www.flipflop.cz;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name flipflop.cz www.flipflop.cz;

    ssl_certificate /etc/letsencrypt/live/flipflop.cz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/flipflop.cz/privkey.pem;

    # API Gateway
    location /api/ {
        proxy_pass http://api-gateway:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend (Next.js)
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. SSL Certificates

Ensure SSL certificates are configured (via existing Nginx setup):

```bash
# Certbot should already be configured in nginx-microservice
# Verify certificates
certbot certificates
```

## Blue/Green Deployment

For zero-downtime deployments:

### Strategy

1. Deploy new version to "green" environment
2. Test green environment
3. Switch traffic from "blue" to "green"
4. Monitor green environment
5. Keep blue as backup

### Implementation

```bash
# 1. Build new images with version tags
docker build -t api-gateway:v2.0.0 .
docker build -t user-service:v2.0.0 .

# 2. Start green environment
docker-compose -f docker-compose.green.yml up -d

# 3. Test green environment
curl http://green-api-gateway:3001/health

# 4. Update Nginx to point to green
# Edit Nginx config to use green services

# 5. Reload Nginx
nginx -s reload

# 6. Monitor logs
docker-compose -f docker-compose.green.yml logs -f

# 7. If successful, stop blue environment
docker-compose -f docker-compose.blue.yml down
```

## Monitoring

### Health Checks

All services provide health check endpoints:

```bash
# Check all services
for service in api-gateway user-service product-service order-service; do
  echo "Checking $service..."
  curl http://localhost:${PORT}/health
done
```

### Log Monitoring

Monitor logs via logging microservice:

```bash
# Query logs
curl "http://localhost:3009/api/logs/query?service=order-service&level=error&limit=50"

# View service-specific logs
tail -f ../logging-microservice/logs/order-service.log
```

### Docker Monitoring

```bash
# View running containers
docker ps

# View resource usage
docker stats

# View logs
docker-compose logs -f service-name
```

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump -h db-server-postgres -U dbadmin ecommerce > backup_${DATE}.sql

# Restore
psql -h db-server-postgres -U dbadmin ecommerce < backup_20250101.sql
```

### Log Backups

Logs are automatically rotated by the logging microservice. Archive old logs:

```bash
# Archive logs older than 30 days
find ../logging-microservice/logs -name "*.log" -mtime +30 -exec tar -czf logs_archive_$(date +%Y%m%d).tar.gz {} \;
```

## Scaling

### Horizontal Scaling

Scale services based on load:

```bash
# Scale order service
docker-compose up -d --scale order-service=3

# Scale product service
docker-compose up -d --scale product-service=2
```

### Load Balancing

Configure Nginx for load balancing:

```nginx
upstream order_service {
    least_conn;
    server order-service-1:3003;
    server order-service-2:3003;
    server order-service-3:3003;
}
```

## Troubleshooting

### Service Not Starting

```bash
# Check logs
docker-compose logs service-name

# Check environment variables
docker-compose config

# Verify network connectivity
docker network inspect nginx-network
```

### Database Connection Issues

```bash
# Test database connection
psql -h db-server-postgres -U dbadmin -d ecommerce

# Check database logs
# (depends on database server setup)
```

### High Memory Usage

```bash
# Check memory usage
docker stats

# Restart services
docker-compose restart

# Scale down if needed
docker-compose up -d --scale service-name=1
```

## Security Checklist

- [ ] All environment variables are set
- [ ] JWT secrets are strong and unique
- [ ] Database passwords are strong
- [ ] API keys are valid and have proper permissions
- [ ] SSL certificates are valid and auto-renewing
- [ ] CORS origins are restricted
- [ ] Firewall rules are configured
- [ ] Regular security updates are applied
- [ ] Logs are monitored for suspicious activity
- [ ] Backups are automated and tested

## Rollback Procedure

If deployment fails:

```bash
# 1. Stop new services
docker-compose down

# 2. Start previous version
docker-compose -f docker-compose.previous.yml up -d

# 3. Update Nginx to point to previous version
nginx -s reload

# 4. Investigate issues in new version
docker-compose logs
```

## Maintenance

### Regular Tasks

1. **Weekly**: Review logs for errors
2. **Monthly**: Update dependencies
3. **Quarterly**: Security audit
4. **As needed**: Database optimization

### Updates

```bash
# Pull latest code
git pull

# Rebuild images
docker-compose build

# Restart services
docker-compose up -d
```

## Production Checklist

Before going live:

- [ ] All services are running
- [ ] Health checks are passing
- [ ] Database is backed up
- [ ] SSL certificates are valid
- [ ] Environment variables are set
- [ ] Monitoring is configured
- [ ] Logging is working
- [ ] Notifications are tested
- [ ] Payment gateway is configured
- [ ] Frontend is deployed
- [ ] Domain is configured
- [ ] DNS is pointing correctly
