# FlipFlop.cz E-commerce Platform - Implementation Plan

## Technology Stack Decisions

- **Frontend**: Next.js 14+ (React) with TypeScript, App Router, Server Components
- **Backend**: NestJS with TypeScript (microservices architecture)
  - **Rationale**: TypeScript-first framework with excellent microservices support, built-in dependency injection, modular architecture, strong typing, and comprehensive ecosystem. Perfect for scalable e-commerce with multiple services.
- **Database**: PostgreSQL (existing separate microservice at ../database-server)
- **Payment Gateway**: PayU (Czech Republic)
- **AI Service**: OpenRouter API (Google Gemini 2.0 Flash)
- **Caching**: Redis
- **Search**: PostgreSQL full-text search (Phase 1), Meilisearch (Phase 3+)
- **Notifications**: Separate microservice (../notification-microservice)
- **Logging**: Separate microservice (../logging-microservice)
- **Containerization**: Docker with Docker Compose
- **Web Server**: Nginx (existing separate microservice at ../nginx-microservice with Certbot/Let's Encrypt already configured)

## Architecture Overview

### Microservices Structure

#### Main E-commerce Project (e-commerce/)

1. **Frontend Service** (Next.js) - Port 3000
2. **API Gateway** (NestJS) - Port 3001
3. **Product Service** (NestJS) - Port 3002
4. **Order Service** (NestJS) - Port 3003
5. **User Service** (NestJS) - Port 3004
6. **Supplier Integration Service** (NestJS) - Port 3006
7. **AI Assistant Service** (NestJS) - Port 3007
8. **Analytics Service** (NestJS) - Port 3008

#### Separate Microservices

9. **Notification Service** (../notification-microservice) - Separate project with <git@github.com>:speakASAP/notification-microservice.git
10. **Logging Service** (../logging-microservice) - Separate project with <git@github.com>:speakASAP/logging-microservice.git

#### External Services (Existing)

11. **Database** (../database-server) - PostgreSQL, already running
12. **Nginx** (../nginx-microservice) - Reverse proxy with Certbot/Let's Encrypt already configured
13. **Redis** (Caching) - Port 6379

## Phase 1: MVP Implementation

### 1.1 Project Initialization & Infrastructure Setup

#### 1.1.1 Main E-commerce Project Setup

- Initialize Git repository: `git init` and connect to `git@github.com:speakASAP/e-commerce.git`
- Create root directory structure
- Create `.gitignore`
- Create root `docker-compose.yml`
- Create root `.env.example` template
- Create `README.md` with project overview
- Create `/docs` directory for documentation

#### 1.1.2 Notification Microservice Setup

- Navigate to `../notification-microservice`
- Initialize Git repository: `git init` and connect to `git@github.com:speakASAP/notification-microservice.git`
- Create project structure for notification service
- Create `.gitignore`
- Create `docker-compose.yml`
- Create `.env.example` template
- Create `README.md`

#### 1.1.3 Logging Microservice Setup

- Navigate to `../logging-microservice`
- Initialize Git repository: `git init` and connect to `git@github.com:speakASAP/logging-microservice.git`
- Create project structure for logging service
- Create `.gitignore`
- Create `docker-compose.yml`
- Create `.env.example` template
- Create `README.md`

#### 1.1.4 Docker Configuration

- Create `Dockerfile` for each microservice in e-commerce project
- Create `docker-compose.yml` with all e-commerce services
- Configure Docker volumes for data persistence
- Set up network configuration (connect to nginx-network)
- Configure environment variable injection
- Connect to existing nginx-network from ../nginx-microservice

#### 1.1.5 Nginx Integration

- Verify Certbot and Let's Encrypt are configured in ../nginx-microservice (already confirmed - certbot/ directory exists with scripts)
- Use existing nginx-microservice scripts for domain setup
- Create Nginx configuration for e-commerce domain using existing templates
- Use existing blue/green deployment script: `../nginx-microservice/scripts/blue-green/deploy.sh e-commerce`
- Configure reverse proxy to e-commerce services
- SSL certificates will be managed by existing nginx-microservice

#### 1.1.6 Environment Configuration

- Create `.env.example` in e-commerce project with all required variables
- Document all environment variables
- Set up configuration for:
  - Database connection (to ../database-server)
  - Redis connection
  - Service ports
  - API keys (PayU, OpenRouter)
  - Logging service URL (../logging-microservice)
  - Notification service URL (../notification-microservice)
- Check existing ../database-server configuration for connection details
- Check existing ../nginx-microservice configuration for network setup

#### 1.1.7 Logging Infrastructure

- Implement logging-microservice in ../logging-microservice
- Create centralized logger utility (`utils/logger.js`) in e-commerce that calls logging-microservice API
- Configure log levels via `.env`
- Set up log file storage in `./logs` (local) and centralized in logging-microservice
- Implement log rotation in logging-microservice
- Add timestamp formatting
- Create API endpoints in logging-microservice for log ingestion

### 1.2 Database Schema Design

#### 1.2.1 Core Tables

- `users` - User accounts and authentication
- `products` - Product master data
- `product_variants` - Product variants (colors, sizes)
- `categories` - Product categories
- `product_categories` - Many-to-many relationship
- `suppliers` - Supplier information
- `supplier_products` - Supplier product mappings
- `cart_items` - Shopping cart
- `orders` - Order master
- `order_items` - Order line items
- `order_status_history` - Order status tracking
- `invoices` - Invoice records
- `proforma_invoices` - Proforma invoice records
- `delivery_addresses` - Customer delivery addresses
- `payment_methods` - Payment method preferences

#### 1.2.2 Indexes & Constraints

- Create indexes on frequently queried columns
- Set up foreign key constraints
- Add unique constraints where needed
- Create full-text search indexes

#### 1.2.3 Migration System

- Set up database migration system (TypeORM migrations)
- Create initial migration files
- Document schema changes

### 1.3 Backend Services - Core Setup

#### 1.3.1 Shared Libraries

- Create `shared` package with common utilities
- Implement shared types/interfaces
- Create database connection module
- Create Redis client module
- Create logger wrapper (calls logging-microservice)
- Create API response formatters
- Create error handling middleware

#### 1.3.2 API Gateway Service

- Initialize NestJS project
- Set up routing to microservices
- Implement authentication middleware
- Configure CORS
- Set up request/response logging (via logging-microservice)
- Implement rate limiting
- Add health check endpoints

#### 1.3.3 User Service

- Initialize NestJS project
- Implement user registration
- Implement user login (JWT authentication)
- Implement password hashing (bcrypt)
- Create user profile endpoints
- Implement delivery address management
- Add user preferences storage
- Create Dockerfile and docker-compose entry

#### 1.3.4 Product Service

- Initialize NestJS project
- Implement product CRUD operations
- Implement category management
- Implement basic product filtering
- Create product search endpoint
- Implement product image handling
- Add product inventory tracking
- Create supplier product mapping
- Create Dockerfile and docker-compose entry

#### 1.3.5 Order Service

- Initialize NestJS project
- Implement cart management
- Implement checkout process
- Integrate PayU payment gateway
- Implement order creation
- Implement order status tracking
- Generate proforma invoices (Czech language)
- Generate final invoices after payment
- Create Dockerfile and docker-compose entry

#### 1.3.6 Supplier Integration Service

- Initialize NestJS project
- Create supplier API connector framework
- Implement product synchronization (one test supplier)
- Implement manual order forwarding endpoint
- Create supplier management interface
- Add supplier API configuration storage
- Create Dockerfile and docker-compose entry

#### 1.3.7 Notification Service (Separate Microservice)

- Navigate to ../notification-microservice
- Initialize NestJS project
- Implement email notification system (SendGrid/Mailgun)
- Implement Telegram Bot API integration
- Implement WhatsApp Business API integration
- Create notification templates
- Implement notification queue
- Add notification history tracking
- Create Dockerfile and docker-compose entry
- Create API endpoints for other services to send notifications
- Connect to logging-microservice for centralized logging

### 1.4 Frontend Application

#### 1.4.1 Next.js Setup

- Initialize Next.js 14+ project with TypeScript
- Configure App Router
- Set up Tailwind CSS for styling
- Configure environment variables
- Set up API client for backend communication
- Create Dockerfile

#### 1.4.2 Core Layout & Components

- Create root layout with header/footer
- Implement responsive navigation menu
- Create loading states
- Create error boundaries
- Set up global state management (Zustand or Context API)

#### 1.4.3 Product Display Pages

- Create product listing page (`/products`)
- Implement product card component
- Create product detail page (`/products/[id]`)
- Add basic product filtering (category)
- Implement responsive grid layout
- Add image optimization

#### 1.4.4 Shopping Cart

- Create cart page (`/cart`)
- Implement add to cart functionality
- Implement cart item management (update, remove)
- Display cart totals
- Add cart persistence (localStorage + backend)

#### 1.4.5 Checkout Process

- Create checkout page (`/checkout`)
- Implement delivery address form
- Integrate PayU payment widget
- Add order summary display
- Implement checkout validation
- Add order confirmation page

#### 1.4.6 User Account Pages

- Create login page (`/login`)
- Create registration page (`/register`)
- Create user dashboard (`/account`)
- Implement order history view
- Add profile settings page
- Create delivery addresses management

#### 1.4.7 Admin Dashboard (Basic)

- Create admin layout
- Implement product management page
  - Product list with pagination
  - Add product form
  - Edit product form
  - Delete product functionality
- Create order management page
  - Order list view
  - Order detail view
  - Order status update interface
- Add basic inventory tracking display

### 1.5 Integration & Configuration

#### 1.5.1 PayU Integration

- Register PayU sandbox account
- Implement PayU SDK integration
- Create payment processing endpoints
- Implement payment callback handling
- Add payment status tracking
- Test payment flow

#### 1.5.2 Supplier API Integration (Test)

- Connect to one test supplier API
- Implement product data fetching
- Create product synchronization job
- Map supplier data to internal schema
- Implement manual sync trigger
- Add error handling and logging

#### 1.5.3 Notification Service Integration

- Configure notification-microservice email service (SendGrid/Mailgun)
- Create email templates in notification-microservice:
  - Order confirmation
  - Payment confirmation
  - Order status updates
- Implement API client in e-commerce services to call notification-microservice
- Add notification delivery tracking in notification-microservice
- Test notification service integration from e-commerce services

### 1.6 Deployment & DevOps

#### 1.6.1 Docker Configuration

- Finalize all Dockerfiles
- Complete docker-compose.yml
- Configure volume mounts for persistence
- Set up environment variable injection
- Test container builds

#### 1.6.2 SSL Certificate Setup

- Certbot and Let's Encrypt already configured in ../nginx-microservice
- Use existing nginx-microservice certificate management
- Document SSL certificate usage process
- Configure domain using existing nginx scripts

#### 1.6.3 Blue/Green Deployment

- Use existing blue/green deployment script from ../nginx-microservice
- Script location: `../nginx-microservice/scripts/blue-green/deploy.sh e-commerce`
- Test deployment process
- Document deployment process
- Configure service registry entry in nginx-microservice

#### 1.6.4 Monitoring & Logging

- Set up centralized log collection via logging-microservice
- Configure log rotation in logging-microservice
- Add service health monitoring
- Create log viewing utilities

### 1.7 Documentation

#### 1.7.1 Technical Documentation

- Architecture documentation
- API documentation (OpenAPI/Swagger)
- Database schema documentation
- Deployment guide (including blue/green deployment)
- Environment variables guide
- Microservices integration guide (notification, logging, nginx, database)

#### 1.7.2 User Documentation

- Admin dashboard user manual
- Supplier integration guide
- Configuration guide

### 1.8 Testing & Quality Assurance (Final Stage)

#### 1.8.1 Unit Tests

- Write tests for critical business logic
- Test authentication flows
- Test payment processing
- Test order creation

#### 1.8.2 Integration Tests

- Test API endpoints
- Test database operations
- Test payment gateway integration
- Test supplier API connection
- Test notification-microservice integration
- Test logging-microservice integration

#### 1.8.3 End-to-End Tests

- Test complete purchase flow
- Test user registration and login
- Test admin product management
- Test order processing

#### 1.8.4 Performance Testing

- Test page load times
- Test API response times
- Optimize slow queries
- Test mobile performance

## Phase 2: Enhanced Functionality (Post-MVP)

### 2.1 Advanced Product Features

- Product variants (colors, sizes) UI and backend
- Product reviews and ratings system
- Product video upload and display
- Image zoom functionality
- Related products algorithm
- Product comparison feature

### 2.2 Multiple Supplier Integration

- Connect additional suppliers
- Automated order forwarding
- Supplier management interface
- Supplier performance monitoring

### 2.3 Enhanced Checkout

- Multiple payment gateways
- Multiple delivery options
- Geolocation-based defaults
- Address autocomplete

### 2.4 Logistics Integration

- Shipping provider APIs
- Package tracking integration
- Tracking number generation
- Delivery status updates

### 2.5 Advanced Filtering

- Multiple filter parameters
- Advanced search with autocomplete
- Price range filters
- Filter persistence

## Phase 3: Marketing & Optimization

### 3.1 Marketing Tools

- Discount system
- Voucher/certificate management
- Loyalty programs
- Daily offers
- Promotional campaigns

### 3.2 AI Shopping Assistant

- OpenRouter API integration
- Chatbot interface
- Voice input support
- Product recommendations
- Guided shopping flow

### 3.3 SEO Enhancement

- AI-friendly Markdown page generation
- Rich content aggregation
- Structured data (JSON-LD)
- SEO management interface

### 3.4 Wishlist & Social

- Favorites functionality
- Social media sharing
- Gift registry features

## Phase 4: Advanced Analytics & Marketplace

### 4.1 Advanced Analytics

- Visual dashboards (Charts.js/Recharts)
- Profit/margin analysis
- Detailed reporting
- Performance metrics

### 4.2 Marketplace Integration

- Export to Allegro
- Export to Heureka
- Export to Zbozi
- Multi-channel sales management

### 4.3 Advertising Networks

- Facebook Marketplace integration
- WhatsApp Business API integration

### 4.4 Advanced Features

- Price drop alerts
- Product bundles
- Alternative product suggestions
- Sticky product header

## Phase 5: Polish & Optimization

### 5.1 Performance Optimization

- Advanced caching strategies
- Image optimization and CDN
- Database query optimization
- Load testing and optimization

### 5.2 UX Refinement

- A/B testing framework
- Conversion optimization
- Mobile experience enhancement
- One-click purchase

### 5.3 Advanced Admin Features

- Financial reports
- Tax reports
- Bank statement integration
- Advanced inventory management
- Claims & returns system

## Implementation Checklist

### Setup & Infrastructure

1. ✅ Initialize e-commerce Git repository: `git init` and connect to `git@github.com:speakASAP/e-commerce.git`
2. Create root project directory structure in e-commerce
3. Create .gitignore in e-commerce
4. Initialize notification-microservice: navigate to ../notification-microservice, `git init`, connect to `git@github.com:speakASAP/notification-microservice.git`
5. Initialize logging-microservice: navigate to ../logging-microservice, `git init`, connect to `git@github.com:speakASAP/logging-microservice.git`
6. Create docker-compose.yml for e-commerce services
7. Create docker-compose.yml for notification-microservice
8. Create docker-compose.yml for logging-microservice
9. Create .env.example in e-commerce with all variables
10. Create .env.example in notification-microservice
11. Create .env.example in logging-microservice
12. Create /docs directory in e-commerce
13. Create /logs directory for log files in e-commerce
14. Verify Certbot/Let's Encrypt setup in ../nginx-microservice (already configured)
15. Check ../database-server configuration for connection details
16. Set up Docker volumes configuration in e-commerce
17. Configure Docker network connection to nginx-network
18. Create centralized logger utility (utils/logger.js) that calls logging-microservice
19. Create README.md with project overview in e-commerce
20. Create README.md in notification-microservice
21. Create README.md in logging-microservice

### Database

22. Design PostgreSQL schema for MVP tables
23. Create TypeORM entities for all MVP tables
24. Create database migration files
25. Set up database connection module (connect to ../database-server)
26. Create indexes and constraints
27. Document database schema

### Backend - Shared

28. Create shared package structure
29. Implement common types/interfaces
30. Create database connection utility
31. Create Redis client module
32. Create logger wrapper (calls logging-microservice)
33. Create API response formatters
34. Create error handling middleware

### Backend - API Gateway

35. Initialize NestJS API Gateway project
36. Configure routing to microservices
37. Implement JWT authentication middleware
38. Configure CORS
39. Set up request/response logging (via logging-microservice)
40. Implement rate limiting
41. Add health check endpoints
42. Create Dockerfile

### Backend - User Service

43. Initialize NestJS User Service
44. Implement user registration endpoint
45. Implement user login with JWT
46. Implement password hashing
47. Create user profile endpoints
48. Implement delivery address CRUD
49. Add user preferences storage
50. Create Dockerfile

### Backend - Product Service

51. Initialize NestJS Product Service
52. Implement product CRUD operations
53. Implement category management
54. Implement basic filtering endpoint
55. Create product search endpoint
56. Implement product image upload
57. Add inventory tracking
58. Create supplier product mapping
59. Create Dockerfile

### Backend - Order Service

60. Initialize NestJS Order Service
61. Implement cart management endpoints
62. Implement checkout process
63. Integrate PayU payment gateway
64. Implement order creation
65. Implement order status tracking
66. Generate proforma invoices (Czech)
67. Generate final invoices
68. Create Dockerfile

### Backend - Supplier Service

69. Initialize NestJS Supplier Service
70. Create supplier API connector framework
71. Implement product sync for test supplier
72. Implement manual order forwarding
73. Create supplier management endpoints
74. Add supplier API config storage
75. Create Dockerfile

### Backend - Notification Service (Separate Microservice)

76. Navigate to ../notification-microservice
77. Initialize NestJS Notification Service project
78. Implement email notification system (SendGrid/Mailgun)
79. Implement Telegram Bot API integration
80. Implement WhatsApp Business API integration
81. Create notification templates
82. Implement notification queue
83. Add notification history tracking
84. Create API endpoints for other services
85. Integrate with logging-microservice
86. Create Dockerfile
87. Create docker-compose.yml entry

### Backend - Logging Service (Separate Microservice)

88. Navigate to ../logging-microservice
89. Initialize NestJS Logging Service project
90. Create API endpoints for log ingestion
91. Implement log storage system
92. Implement log rotation
93. Create log query/search endpoints
94. Create Dockerfile
95. Create docker-compose.yml entry

### Frontend - Setup

96. Initialize Next.js 14+ project with TypeScript
97. Configure App Router
98. Set up Tailwind CSS
99. Configure environment variables
100. Set up API client
101. Create Dockerfile

### Frontend - Core Components

102. Create root layout with header/footer
103. Implement responsive navigation
104. Create loading components
105. Create error boundaries
106. Set up global state management

### Frontend - Product Pages

107. Create product listing page
108. Implement product card component
109. Create product detail page
110. Add basic category filtering
111. Implement responsive grid
112. Add image optimization

### Frontend - Cart & Checkout

113. Create cart page
114. Implement add to cart
115. Implement cart item management
116. Create checkout page
117. Integrate PayU payment widget
118. Add order confirmation page

### Frontend - User Account

119. Create login page
120. Create registration page
121. Create user dashboard
122. Implement order history
123. Add profile settings
124. Create address management

### Frontend - Admin Dashboard

125. Create admin layout
126. Create product management page
127. Create add/edit product forms
128. Create order management page
129. Create order detail view
130. Add order status update UI
131. Add inventory display

### Integration

132. Register PayU sandbox account
133. Implement PayU SDK in Order Service
134. Create payment processing endpoints
135. Implement payment callbacks
136. Connect test supplier API
137. Implement product sync job
138. Configure notification-microservice email service (SendGrid/Mailgun)
139. Create email templates in notification-microservice
140. Implement API client in e-commerce services to call notification-microservice
141. Test notification service integration
142. Configure connection to logging-microservice from all services

### Deployment

143. Finalize all Dockerfiles
144. Complete docker-compose.yml for e-commerce
145. Complete docker-compose.yml for notification-microservice
146. Complete docker-compose.yml for logging-microservice
147. Configure volume mounts
148. Configure Docker network connections to nginx-network
149. Use existing nginx-microservice for SSL certificates
150. Configure domain using nginx-microservice scripts
151. Test blue/green deployment using existing script
152. Configure service registry in nginx-microservice

### Testing (Final Stage)

153. Write unit tests for critical logic
154. Write integration tests for APIs
155. Write integration tests for notification-microservice
156. Write integration tests for logging-microservice
157. Write E2E tests for user flows
158. Perform performance testing
159. Test microservices communication
160. Test blue/green deployment process

### Documentation

161. Write architecture documentation
162. Create API documentation (Swagger) for e-commerce services
163. Create API documentation for notification-microservice
164. Create API documentation for logging-microservice
165. Document database schema
166. Write deployment guide (including blue/green deployment)
167. Create environment variables guide for all projects
168. Write admin user manual
169. Document microservices integration (notification, logging, nginx, database)

---

**Last Updated**: 2025-01-27
**Status**: In Progress - Phase 1 MVP Implementation
**Current Phase**: Setup & Infrastructure
