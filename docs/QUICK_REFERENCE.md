# Quick Reference Guide

Quick reference for common tasks and commands in the FlipFlop.cz platform.

## 🚀 Quick Commands

### Start/Stop Services

```bash
# Start all services
./scripts/start-all.sh

# Stop all services
./scripts/stop-all.sh

# Restart a service
./scripts/restart-service.sh [service-name]
```

### Health & Monitoring

```bash
# Check all services
./scripts/health-check.sh

# View logs
./scripts/view-logs.sh all --follow
./scripts/view-logs.sh [service-name] --follow
```

## 🌐 Service URLs

### Development

- Frontend: <http://localhost:3000>
- API Gateway: <http://localhost:3001>
- User Service: <http://localhost:3004>
- Product Service: <http://localhost:3002>
- Order Service: <http://localhost:3003>
- Supplier Service: <http://localhost:3006>
- AI Service: <http://localhost:3007>
- Analytics Service: <http://localhost:3008>
- Logging Service: <http://localhost:3009>
- Notification Service: <http://localhost:3010>

### API Endpoints

- Base URL: <http://localhost:3001/api>
- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Products: `/api/products/*`
- Cart: `/api/cart/*`
- Orders: `/api/orders/*`
- PayU: `/api/payu/*`
- Suppliers: `/api/suppliers/*`
- AI: `/api/ai/*`
- Analytics: `/api/analytics/*`

## 🔑 Common API Calls

### Authentication

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Products

```bash
# Get products
curl http://localhost:3001/api/products

# Search products
curl "http://localhost:3001/api/products?search=shoes&page=1&limit=20"
```

### Cart (requires auth)

```bash
# Get cart
curl http://localhost:3001/api/cart \
  -H "Authorization: Bearer {token}"

# Add to cart
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"productId":"uuid","quantity":2}'
```

## 🐳 Docker Commands

### Build

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build [service-name]
```

### Run

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d [service-name]

# View logs
docker-compose logs -f [service-name]
```

### Network

```bash
# Create network
docker network create nginx-network

# Inspect network
docker network inspect nginx-network
```

## 📁 Key Directories

- `services/` - All microservices
- `shared/` - Shared libraries and entities
- `scripts/` - Management scripts
- `docs/` - Documentation
- `logs/` - Application logs

## 🔧 Environment Variables

Key variables (see `docs/ENVIRONMENT_VARIABLES.md` for complete list):

```env
# Database
DB_HOST=db-server-postgres
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-secret-key

# PayU
PAYU_MERCHANT_ID=your-merchant-id
PAYU_CLIENT_SECRET=your-client-secret

# OpenRouter
OPENROUTER_API_KEY=your-api-key

# SendGrid
SENDGRID_API_KEY=your-api-key
```

## 🐛 Troubleshooting

### Service won't start

```bash
# Check Docker
docker info

# Check logs
./scripts/view-logs.sh [service-name]

# Check health
./scripts/health-check.sh
```

### Database connection issues

```bash
# Test connection
psql -h db-server-postgres -U dbadmin -d ecommerce

# Check environment
cat .env | grep DB_
```

### API errors

```bash
# Check service logs
./scripts/view-logs.sh api-gateway --follow

# Test endpoint
curl http://localhost:3001/health
```

## 📚 Documentation Quick Links

- [Quick Start](QUICK_START.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Testing Guide](TESTING_GUIDE.md)
- [Integration Guide](INTEGRATION_GUIDE.md)

## 🔄 Common Workflows

### Development Workflow

```bash
# 1. Start services
./scripts/start-all.sh

# 2. Make changes
# Edit code...

# 3. Restart service
./scripts/restart-service.sh [service-name]

# 4. Check logs
./scripts/view-logs.sh [service-name] --follow
```

### Testing Workflow

```bash
# 1. Start services
./scripts/start-all.sh

# 2. Check health
./scripts/health-check.sh

# 3. Run tests
# See TESTING_GUIDE.md

# 4. View logs
./scripts/view-logs.sh all --follow
```

### Deployment Workflow

```bash
# 1. Review checklist
cat docs/DEPLOYMENT_CHECKLIST.md

# 2. Configure environment
# Edit .env files

# 3. Build images
docker-compose build

# 4. Deploy
./scripts/start-all.sh

# 5. Verify
./scripts/health-check.sh
```

## 📞 Support

- Documentation: `/docs` directory
- Logs: `./scripts/view-logs.sh`
- Health: `./scripts/health-check.sh`
- Issues: Check service logs and documentation

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: November 13, 2024
