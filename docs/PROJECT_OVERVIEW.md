# Project Overview - FlipFlop.cz

## Executive Summary

FlipFlop.cz is a modern, fully automated e-commerce platform designed for the Czech Republic market. The platform integrates with multiple wholesale suppliers, synchronizes product data automatically, processes orders seamlessly, and provides an exceptional customer experience with minimal human intervention.

## Project Goals

1. **Maximize Conversion Rates** - Through automation, speed, and user-friendly design
2. **Encourage Repeat Purchases** - Via excellent UX and high-quality product presentation
3. **Full Automation** - Minimal human intervention required
4. **Scalability** - Handle growth and increased traffic
5. **Multi-channel Operations** - Support various sales channels

## Architecture

### Microservices Architecture

The platform is built using a microservices architecture with 9 independent services:

```text
┌─────────────────────────────────────────┐
│         Frontend (Next.js)              │
│         Port 3000                       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         API Gateway                    │
│         Port 3001                     │
│         Request Routing                │
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
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌──────────┐
    │Supplier│  │   AI   │  │Analytics │
    │  3006  │  │  3007  │  │   3008   │
    └────────┘  └────────┘  └──────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Notification │ │   Logging    │ │  PostgreSQL  │
│    3010     │ │    3009      │ │   Database   │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Service Responsibilities

1. **API Gateway** - Single entry point, request routing, authentication
2. **User Service** - User accounts, authentication, delivery addresses
3. **Product Service** - Product catalog, categories, search, filtering
4. **Order Service** - Shopping cart, checkout, order management, payments
5. **Supplier Service** - Supplier integration, product synchronization
6. **AI Service** - AI shopping assistant, product recommendations
7. **Analytics Service** - Sales analytics, revenue reporting, margin analysis
8. **Notification Service** - Multi-channel notifications (Email, Telegram, WhatsApp)
9. **Logging Service** - Centralized log collection and querying

## Technology Stack

### Backend

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Caching**: Redis
- **Authentication**: JWT (Passport)

### Integrations

- **Payment**: PayU (Czech Republic)
- **AI**: OpenRouter API (Google Gemini 2.0 Flash)
- **Email**: SendGrid
- **Telegram**: Telegram Bot API
- **WhatsApp**: WhatsApp Business API

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (Certbot)
- **Logging**: Winston (with daily rotation)

### Frontend (To be implemented)

- **Framework**: Next.js (React)
- **Language**: TypeScript

## Key Features

### Customer-Facing Features

- ✅ User registration and authentication
- ✅ Product browsing with search and filters
- ✅ Shopping cart management
- ✅ Secure checkout process
- ✅ Multiple payment methods (PayU)
- ✅ Order tracking
- ✅ Delivery address management
- ✅ AI shopping assistant
- ✅ Product recommendations

### Admin Features

- ✅ Product management (CRUD)
- ✅ Category management
- ✅ Supplier management
- ✅ Order management
- ✅ Analytics dashboard
- ✅ Sales reporting
- ✅ Revenue analysis

### Automation Features

- ✅ Automatic product synchronization from suppliers
- ✅ Scheduled product sync (hourly)
- ✅ Automatic order processing
- ✅ Payment status updates
- ✅ Order status notifications
- ✅ Centralized logging

## Data Flow

### Product Synchronization

1. Supplier Service fetches products from supplier APIs
2. Products are mapped and stored in database
3. Product Service makes products available to customers
4. Inventory is updated automatically

### Order Processing

1. Customer adds items to cart
2. Customer proceeds to checkout
3. Order is created in Order Service
4. Payment is processed via PayU
5. Order confirmation notification is sent
6. Order status is tracked
7. Shipment notification is sent when shipped

### Notification Flow

1. Event occurs (order created, payment received, etc.)
2. Service calls Notification Microservice
3. Notification is sent via appropriate channel (Email/Telegram/WhatsApp)
4. Notification status is logged

## Database Schema

### Core Entities

- **Users** - User accounts and profiles
- **Products** - Product catalog
- **Categories** - Product categories
- **Product Variants** - Product variations (size, color, etc.)
- **Orders** - Customer orders
- **Order Items** - Order line items
- **Cart Items** - Shopping cart items
- **Delivery Addresses** - User delivery addresses
- **Suppliers** - Supplier information
- **Supplier Products** - Supplier product mappings
- **Invoices** - Order invoices
- **Payment Methods** - Payment method configurations

See [Database Schema Documentation](DATABASE_SCHEMA.md) for details.

## Security

### Authentication & Authorization

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (to be implemented)
- API Gateway validates all requests

### Data Protection

- Environment variables for sensitive data
- Secure password storage
- HTTPS/SSL for all communications
- Input validation on all endpoints

### Payment Security

- PayU handles payment processing
- No credit card data stored locally
- Payment webhook signature verification

## Scalability

### Horizontal Scaling

- Services can be scaled independently
- Load balancing via Nginx
- Stateless service design
- Database connection pooling

### Performance Optimization

- Redis caching for frequently accessed data
- Database indexing
- Efficient query patterns
- Log rotation to manage disk space

## Monitoring & Logging

### Health Checks

- All services provide `/health` endpoints
- Docker health checks configured
- Automated health monitoring scripts

### Logging

- Centralized logging via Logging Microservice
- Service-specific log files
- Error log separation
- Daily log rotation
- Queryable log storage

### Analytics

- Sales data tracking
- Revenue analysis
- Product performance metrics
- Profit margin calculations

## Deployment

### Development

- Docker Compose for local development
- Hot reload for development
- Local database and services

### Production

- Docker containers for all services
- Nginx reverse proxy
- SSL certificates (Let's Encrypt)
- Blue/Green deployment strategy
- Automated backups

## Project Status

### ✅ Completed

- All 9 microservices implemented
- Database schema and entities
- API Gateway routing
- Payment integration (PayU)
- Supplier integration framework
- AI assistant integration
- Notification system
- Logging system
- Docker configurations
- Management scripts
- Comprehensive documentation

### 🚧 In Progress

- Frontend implementation (Next.js)
- Integration testing
- Performance optimization

### 📋 Planned

- Advanced analytics
- Marketing features
- Customer reviews and ratings
- Wishlist functionality
- Product recommendations engine
- Email marketing integration

## Development Workflow

1. **Local Development**

   ```bash
   ./scripts/start-all.sh
   # Make changes
   ./scripts/restart-service.sh [service]
   ```

2. **Testing**
   - Unit tests (to be implemented)
   - Integration tests (to be implemented)
   - API testing via Postman/cURL

3. **Deployment**
   - Build Docker images
   - Deploy to production
   - Monitor health and logs

## Team & Resources

### Required Skills

- TypeScript/JavaScript
- NestJS framework
- PostgreSQL
- Docker
- API integration
- Payment gateway integration

### External Services

- PayU account (payment processing)
- SendGrid account (email)
- Telegram Bot (notifications)
- WhatsApp Business API (notifications)
- OpenRouter API (AI)

## Success Metrics

### Technical Metrics

- Service uptime > 99.9%
- API response time < 200ms
- Zero data loss
- Automated deployments

### Business Metrics

- Conversion rate
- Average order value
- Customer retention
- Revenue growth
- Order processing time

## Future Enhancements

1. **Advanced Features**
   - Customer reviews and ratings
   - Wishlist functionality
   - Product comparison
   - Advanced search with filters
   - Personalized recommendations

2. **Marketing**
   - Email marketing campaigns
   - Promotional codes and discounts
   - Loyalty program
   - Referral system

3. **Analytics**
   - Advanced reporting
   - Customer behavior analysis
   - Sales forecasting
   - Inventory optimization

4. **Integration**
   - Additional payment gateways
   - Shipping provider integration
   - Accounting system integration
   - CRM integration

## Documentation

All documentation is available in the `/docs` directory:

- [Quick Start Guide](QUICK_START.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Integration Guide](INTEGRATION_GUIDE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Environment Variables](ENVIRONMENT_VARIABLES.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Implementation Plan](IMPLEMENTATION_PLAN.md)

## Support & Maintenance

### Regular Maintenance

- Weekly log review
- Monthly dependency updates
- Quarterly security audit
- Database optimization as needed

### Support Channels

- Documentation in `/docs`
- Service logs via logging microservice
- Health checks via management scripts

## Conclusion

FlipFlop.cz is a comprehensive, modern e-commerce platform built with best practices in mind. The microservices architecture ensures scalability, maintainability, and reliability. All backend services are complete and ready for frontend development and production deployment.
