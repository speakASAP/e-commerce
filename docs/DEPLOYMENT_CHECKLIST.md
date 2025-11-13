# Deployment Checklist

Pre-production deployment checklist for FlipFlop.cz e-commerce platform.

## Pre-Deployment

### Environment Setup

- [ ] All environment variables configured
- [ ] Database credentials set
- [ ] API keys configured (PayU, SendGrid, Telegram, WhatsApp, OpenRouter)
- [ ] JWT secrets generated (strong, unique)
- [ ] CORS origins configured
- [ ] SSL certificates ready
- [ ] Domain name configured
- [ ] DNS records set

### Database

- [ ] PostgreSQL database created
- [ ] Database user created with proper permissions
- [ ] Database migrations run
- [ ] Initial data seeded (if needed)
- [ ] Database backup configured
- [ ] Connection tested from all services

### External Services

- [ ] PayU account created and configured
- [ ] SendGrid account created and verified
- [ ] Telegram bot created and token obtained
- [ ] WhatsApp Business API configured
- [ ] OpenRouter API key obtained
- [ ] All API credentials tested

### Infrastructure

- [ ] Docker installed on server
- [ ] Docker Compose installed
- [ ] Nginx installed and configured
- [ ] SSL certificates (Let's Encrypt) configured
- [ ] Firewall rules configured
- [ ] Network setup verified
- [ ] Domain pointing to server

## Code Preparation

### Backend Services

- [ ] All services build successfully
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Environment variables documented
- [ ] Dockerfiles tested
- [ ] Health checks working

### Frontend

- [ ] Next.js build successful
- [ ] No build errors
- [ ] Environment variables set
- [ ] API URLs configured
- [ ] Production build tested

### Docker

- [ ] All Docker images build
- [ ] Docker Compose configuration tested
- [ ] Network connectivity verified
- [ ] Volume mounts configured
- [ ] Health checks configured

## Security

### Authentication

- [ ] JWT secrets are strong and unique
- [ ] Password hashing verified
- [ ] Token expiration configured
- [ ] Protected routes working

### Data Protection

- [ ] Environment variables not in code
- [ ] Database passwords strong
- [ ] API keys secured
- [ ] SSL/TLS configured
- [ ] CORS properly configured

### Security Headers

- [ ] Security headers configured in Nginx
- [ ] HTTPS enforced
- [ ] HSTS enabled
- [ ] XSS protection enabled

## Testing

### Functional Testing

- [ ] User registration works
- [ ] User login works
- [ ] Product browsing works
- [ ] Shopping cart works
- [ ] Checkout process works
- [ ] Payment integration works
- [ ] Order management works
- [ ] Profile management works

### Integration Testing

- [ ] All services communicate correctly
- [ ] API Gateway routing works
- [ ] Database connections stable
- [ ] External API integrations work
- [ ] Notifications sent successfully

### Performance Testing

- [ ] Load testing completed
- [ ] Response times acceptable
- [ ] Database queries optimized
- [ ] Caching configured
- [ ] Resource usage acceptable

## Deployment Steps

### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clone Repositories

```bash
# Main platform
git clone git@github.com:speakASAP/e-commerce.git
cd e-commerce

# Notification service
cd ..
git clone git@github.com:speakASAP/notification-microservice.git

# Logging service
cd ..
git clone git@github.com:speakASAP/logging-microservice.git
```

### 3. Configure Environment

```bash
# Create .env files
cd e-commerce
cp .env.example .env
# Edit .env with production values

cd ../notification-microservice
cp .env.example .env
# Edit .env

cd ../logging-microservice
cp .env.example .env
# Edit .env
```

### 4. Create Docker Network

```bash
docker network create nginx-network
```

### 5. Build Images

```bash
# Main platform
cd e-commerce
docker-compose build

# Notification service
cd ../notification-microservice
docker-compose build

# Logging service
cd ../logging-microservice
docker-compose build
```

### 6. Start Services

```bash
# Start all services
cd e-commerce
./scripts/start-all.sh

# Or manually
cd ../logging-microservice
docker-compose up -d

cd ../notification-microservice
docker-compose up -d

cd ../e-commerce
docker-compose up -d
```

### 7. Verify Deployment

```bash
# Check all services
./scripts/health-check.sh

# Check logs
./scripts/view-logs.sh all --follow

# Test API
curl http://localhost:3001/api/products
```

### 8. Configure Nginx

```nginx
# /etc/nginx/sites-available/flipflop.cz
server {
    listen 80;
    server_name flipflop.cz www.flipflop.cz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name flipflop.cz www.flipflop.cz;

    ssl_certificate /etc/letsencrypt/live/flipflop.cz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/flipflop.cz/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

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

    # Frontend
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

### 9. Set Up SSL

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d flipflop.cz -d www.flipflop.cz

# Test auto-renewal
sudo certbot renew --dry-run
```

### 10. Configure Firewall

```bash
# Allow HTTP, HTTPS, SSH
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Post-Deployment

### Verification

- [ ] All services running
- [ ] Health checks passing
- [ ] Website accessible
- [ ] API endpoints working
- [ ] SSL certificate valid
- [ ] Database connected
- [ ] External services connected

### Monitoring

- [ ] Logging working
- [ ] Health monitoring set up
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured

### Backup

- [ ] Database backup automated
- [ ] Backup tested
- [ ] Backup retention policy set
- [ ] Disaster recovery plan documented

### Documentation

- [ ] Deployment documented
- [ ] Runbook created
- [ ] Troubleshooting guide ready
- [ ] Contact information updated

## Rollback Plan

### If Deployment Fails

1. Stop new services
2. Start previous version
3. Update Nginx configuration
4. Verify services working
5. Investigate issues
6. Fix problems
7. Retry deployment

### Rollback Commands

```bash
# Stop current services
docker-compose down

# Start previous version
docker-compose -f docker-compose.previous.yml up -d

# Verify
./scripts/health-check.sh
```

## Maintenance

### Regular Tasks

- [ ] Weekly log review
- [ ] Monthly dependency updates
- [ ] Quarterly security audit
- [ ] Database optimization
- [ ] SSL certificate renewal (automatic)

### Updates

- [ ] Pull latest code
- [ ] Test in staging
- [ ] Backup database
- [ ] Deploy updates
- [ ] Verify functionality
- [ ] Monitor logs

## Support

### Monitoring Tools

- Health check scripts
- Log viewing scripts
- Docker monitoring
- Database monitoring

### Troubleshooting

- Check service logs
- Verify network connectivity
- Test database connections
- Check external service status
- Review error logs

## Success Criteria

### Technical

- ✅ All services running
- ✅ Health checks passing
- ✅ Response times < 500ms
- ✅ Zero critical errors
- ✅ SSL certificate valid

### Business

- ✅ Website accessible
- ✅ Users can register
- ✅ Products display correctly
- ✅ Shopping cart works
- ✅ Checkout process works
- ✅ Payments process
- ✅ Orders created successfully

## Final Checklist

Before going live:

- [ ] All items above completed
- [ ] Team notified
- [ ] Monitoring active
- [ ] Support ready
- [ ] Documentation complete
- [ ] Backup verified
- [ ] Rollback plan ready

---

**Ready for Production**: ✅ Complete all items above before deployment.
