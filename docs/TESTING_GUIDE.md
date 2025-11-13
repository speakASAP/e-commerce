# Testing Guide

Comprehensive testing guide for the FlipFlop.cz e-commerce platform.

## Testing Strategy

### 1. Unit Testing

Test individual components and functions in isolation.

### 2. Integration Testing

Test service interactions and API endpoints.

### 3. End-to-End Testing

Test complete user workflows.

### 4. Performance Testing

Test system performance under load.

## Manual Testing Checklist

### Authentication Flow

#### User Registration

- [ ] Register with valid data
- [ ] Register with invalid email
- [ ] Register with weak password
- [ ] Register with existing email
- [ ] Verify email validation
- [ ] Verify password requirements

#### User Login

- [ ] Login with valid credentials
- [ ] Login with invalid email
- [ ] Login with wrong password
- [ ] Verify token storage
- [ ] Verify session persistence

#### User Logout

- [ ] Logout clears token
- [ ] Logout redirects to home
- [ ] Protected routes inaccessible after logout

### Product Catalog

#### Product Listing

- [ ] Display products correctly
- [ ] Pagination works
- [ ] Search functionality
- [ ] Filter by category
- [ ] Filter by price range
- [ ] Filter by brand
- [ ] Sort products
- [ ] Empty state display

#### Product Details

- [ ] Display product information
- [ ] Show product variants
- [ ] Display stock status
- [ ] Add to cart functionality
- [ ] Related products (if implemented)

### Shopping Cart

#### Cart Operations

- [ ] Add product to cart
- [ ] Update quantity
- [ ] Remove item from cart
- [ ] Clear cart
- [ ] Cart persists across sessions
- [ ] Cart total calculation
- [ ] Empty cart state

### Checkout Process

#### Checkout Flow

- [ ] Select delivery address
- [ ] Add new address
- [ ] Order summary display
- [ ] Shipping cost calculation
- [ ] Tax calculation
- [ ] Total calculation
- [ ] Create order
- [ ] Redirect to payment

### Order Management

#### Order List

- [ ] Display user orders
- [ ] Order status display
- [ ] Order date display
- [ ] Order total display
- [ ] Empty orders state

#### Order Details

- [ ] Display order information
- [ ] Show order items
- [ ] Display delivery address
- [ ] Show order summary
- [ ] Order status updates

### User Profile

#### Profile Management

- [ ] Display user information
- [ ] Update profile
- [ ] Validation errors
- [ ] Success messages

#### Address Management

- [ ] List addresses
- [ ] Add new address
- [ ] Edit address
- [ ] Delete address
- [ ] Set default address
- [ ] Address validation

## API Testing

### Using cURL

#### Authentication

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Products

```bash
# Get products
curl http://localhost:3001/api/products

# Get product
curl http://localhost:3001/api/products/{id}

# Search products
curl "http://localhost:3001/api/products?search=shoes&page=1&limit=20"
```

#### Cart

```bash
# Get cart (requires auth)
curl http://localhost:3001/api/cart \
  -H "Authorization: Bearer {token}"

# Add to cart
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "uuid",
    "quantity": 2
  }'
```

#### Orders

```bash
# Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryAddressId": "uuid",
    "paymentMethod": "payu"
  }'

# Get orders
curl http://localhost:3001/api/orders \
  -H "Authorization: Bearer {token}"
```

### Using Postman

1. **Import Collection**
   - Create a new collection
   - Add all API endpoints
   - Set up environment variables

2. **Set Up Authentication**
   - Create login request
   - Extract token from response
   - Set token as collection variable
   - Use token in Authorization header

3. **Test Workflows**
   - Register → Login → Get Profile
   - Add to Cart → Get Cart → Create Order
   - Create Order → Get Orders → Get Order Details

## Integration Testing

### Service Communication

#### Test API Gateway Routing

```bash
# Test routing to User Service
curl http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer {token}"

# Test routing to Product Service
curl http://localhost:3001/api/products

# Test routing to Order Service
curl http://localhost:3001/api/cart \
  -H "Authorization: Bearer {token}"
```

#### Test Database Connections

- Verify all services can connect to database
- Test CRUD operations
- Verify transactions

#### Test External Services

- Test PayU integration (sandbox)
- Test SendGrid email sending
- Test Telegram notifications
- Test WhatsApp notifications
- Test OpenRouter AI API

### End-to-End Workflows

#### Complete Purchase Flow

1. Register new user
2. Browse products
3. Add products to cart
4. Proceed to checkout
5. Select delivery address
6. Create order
7. Process payment
8. Verify order status
9. Check order in order list

#### Supplier Sync Flow

1. Add supplier
2. Configure supplier API
3. Trigger product sync
4. Verify products imported
5. Check product data accuracy

## Performance Testing

### Load Testing

#### Using Apache Bench

```bash
# Test API Gateway
ab -n 1000 -c 10 http://localhost:3001/api/products

# Test with authentication
ab -n 1000 -c 10 -H "Authorization: Bearer {token}" \
  http://localhost:3001/api/cart
```

#### Using k6

```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  let response = http.get('http://localhost:3001/api/products');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

### Stress Testing

- Test system under maximum load
- Identify bottlenecks
- Test failure scenarios
- Verify recovery

## Security Testing

### Security Authentication

- [ ] JWT token validation
- [ ] Token expiration
- [ ] Invalid token handling
- [ ] Password hashing
- [ ] CSRF protection

### Authorization

- [ ] Protected routes
- [ ] Role-based access (if implemented)
- [ ] Resource ownership verification

### Input Validation

- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Input sanitization
- [ ] File upload validation

## Error Handling Testing

### Test Error Scenarios

- [ ] Network errors
- [ ] Service unavailable
- [ ] Invalid input
- [ ] Missing resources
- [ ] Database errors
- [ ] Payment failures

### Verify Error Messages

- [ ] User-friendly error messages
- [ ] Appropriate HTTP status codes
- [ ] Error logging
- [ ] Error recovery

## Browser Testing

### Supported Browsers

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Testing

- [ ] Responsive design
- [ ] Touch interactions
- [ ] Mobile navigation
- [ ] Mobile forms

## Accessibility Testing

### WCAG Compliance

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast
- [ ] Alt text for images
- [ ] Form labels
- [ ] ARIA attributes

## Automated Testing Setup

### Frontend Testing (Jest + React Testing Library)

```bash
# Install dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

### Backend Testing (Jest)

```bash
# Install dependencies
npm install --save-dev @nestjs/testing jest

# Run tests
npm test
```

### E2E Testing (Playwright)

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

## Test Data Management

### Seed Data

- Create test users
- Create test products
- Create test orders
- Create test suppliers

### Test Database

- Use separate test database
- Reset database between tests
- Use fixtures for consistent data

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run lint
```

## Monitoring and Logging

### Test Logging

- Verify logs are created
- Check log levels
- Verify log rotation
- Test log querying

### Test Health Checks

```bash
# Check all services
./scripts/health-check.sh

# Check individual service
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

## Test Results Documentation

### Test Report Template

- Test case ID
- Test description
- Expected result
- Actual result
- Status (Pass/Fail)
- Notes

### Bug Reporting

- Bug ID
- Description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots
- Environment details

## Best Practices

1. **Test Early and Often**
   - Write tests during development
   - Run tests before commits
   - Continuous testing in CI/CD

2. **Test Coverage**
   - Aim for high code coverage
   - Test edge cases
   - Test error scenarios

3. **Test Isolation**
   - Each test should be independent
   - Clean up after tests
   - Use test fixtures

4. **Realistic Testing**
   - Use realistic test data
   - Test real user scenarios
   - Test under realistic conditions

5. **Documentation**
   - Document test cases
   - Keep test results
   - Update tests with code changes

## Quick Test Commands

```bash
# Start all services
./scripts/start-all.sh

# Check health
./scripts/health-check.sh

# View logs
./scripts/view-logs.sh all --follow

# Test API
curl http://localhost:3001/api/products

# Test frontend
cd services/frontend
npm run dev
# Open http://localhost:3000
```

## Conclusion

Comprehensive testing ensures the platform is reliable, secure, and performs well. Follow this guide to test all aspects of the FlipFlop.cz e-commerce platform.
