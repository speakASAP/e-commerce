# API Documentation

Complete API reference for the FlipFlop.cz e-commerce platform.

**Base URL**: `http://localhost:3001/api` (via API Gateway)

All endpoints require authentication unless specified otherwise. Include the JWT token in the Authorization header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Authentication

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+420123456789"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

## User Management

### Get User Profile

```http
GET /users/profile
Authorization: Bearer {token}
```

### Update User Profile

```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+420123456789"
}
```

## Delivery Addresses

### Get User Addresses

```http
GET /delivery-addresses
Authorization: Bearer {token}
```

### Create Address

```http
POST /delivery-addresses
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "street": "Main Street 123",
  "city": "Prague",
  "postalCode": "12000",
  "country": "Czech Republic",
  "phone": "+420123456789",
  "isDefault": true
}
```

### Update Address

```http
PUT /delivery-addresses/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "street": "New Street 456",
  "city": "Brno"
}
```

### Delete Address

```http
DELETE /delivery-addresses/:id
Authorization: Bearer {token}
```

## Products

### List Products

```http
GET /products?page=1&limit=20&search=shoes&minPrice=100&maxPrice=500&brand=nike&categoryId=uuid
```

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search term
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `brand` - Brand filter
- `categoryId` - Category filter

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Get Product Details

```http
GET /products/:id
```

### Create Product (Admin)

```http
POST /products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Product Name",
  "sku": "SKU-001",
  "description": "Product description",
  "price": 999.99,
  "stockQuantity": 100,
  "brand": "Brand Name",
  "categoryIds": ["category-uuid-1", "category-uuid-2"]
}
```

### Update Product (Admin)

```http
PUT /products/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 899.99,
  "stockQuantity": 50
}
```

### Delete Product (Admin)

```http
DELETE /products/:id
Authorization: Bearer {token}
```

## Categories

### List Categories

```http
GET /categories
```

### Get Category

```http
GET /categories/:id
```

### Create Category (Admin)

```http
POST /categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Category Name",
  "description": "Category description",
  "parentId": "parent-category-uuid" // optional
}
```

## Shopping Cart

### Get Cart

```http
GET /cart
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "productId": "uuid",
        "product": {...},
        "variantId": "uuid",
        "variant": {...},
        "quantity": 2,
        "price": 999.99
      }
    ],
    "total": 1999.98,
    "itemCount": 2
  }
}
```

### Add to Cart

```http
POST /cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "uuid",
  "variantId": "uuid", // optional
  "quantity": 2
}
```

### Update Cart Item

```http
PUT /cart/items/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

### Remove from Cart

```http
DELETE /cart/items/:id
Authorization: Bearer {token}
```

### Clear Cart

```http
DELETE /cart
Authorization: Bearer {token}
```

## Orders

### Create Order

```http
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "deliveryAddressId": "address-uuid",
  "paymentMethod": "payu",
  "notes": "Please deliver in the morning",
  "shippingCost": 99.99,
  "discount": 0
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-2025-000001",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "total": 2099.97,
    "items": [...],
    "deliveryAddress": {...}
  }
}
```

### Get User Orders

```http
GET /orders
Authorization: Bearer {token}
```

### Get Order Details

```http
GET /orders/:id
Authorization: Bearer {token}
```

## Payment (PayU)

### Create Payment

```http
POST /payu/create-payment/:orderId
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "redirectUri": "https://secure.payu.com/...",
    "orderId": "payu-order-id"
  }
}
```

### Verify Payment

```http
GET /payu/verify/:orderId
```

### Payment Webhook

```http
POST /payu/notify
Content-Type: application/json

{
  "order": {
    "orderId": "payu-order-id",
    "status": "COMPLETED"
  }
}
```

## Suppliers

### List Suppliers

```http
GET /suppliers
```

### Get Supplier

```http
GET /suppliers/:id
```

### Create Supplier (Admin)

```http
POST /suppliers
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Supplier Name",
  "contactEmail": "supplier@example.com",
  "contactPhone": "+420123456789",
  "apiUrl": "https://supplier-api.com",
  "apiKey": "api-key",
  "autoSyncProducts": true,
  "autoForwardOrders": false
}
```

### Sync Products

```http
POST /suppliers/:id/sync
Authorization: Bearer {token}
```

## AI Assistant

### Chat with AI

```http
POST /ai/chat
Content-Type: application/json

{
  "message": "What products do you have?",
  "context": {
    "userId": "uuid",
    "sessionId": "session-uuid"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": "AI response in Czech language"
}
```

### Get Product Recommendations

```http
GET /ai/recommendations/:productId
```

**Response:**

```json
{
  "success": true,
  "data": ["product-uuid-1", "product-uuid-2", "product-uuid-3"]
}
```

## Analytics

### Get Sales Data

```http
GET /analytics/sales?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalSales": 50000.00,
    "orderCount": 150,
    "averageOrderValue": 333.33,
    "period": {
      "startDate": "2025-01-01",
      "endDate": "2025-01-31"
    }
  }
}
```

### Get Revenue Data

```http
GET /analytics/revenue?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer {token}
```

### Get Product Analytics

```http
GET /analytics/products?productId=uuid
Authorization: Bearer {token}
```

### Get Margin Analysis

```http
GET /analytics/margins?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer {token}
```

## Error Responses

All endpoints return errors in a standard format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

### Common Error Codes

- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `VALIDATION_ERROR` - Request validation failed
- `INTERNAL_ERROR` - Server error
- `BAD_REQUEST` - Invalid request

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Email is required",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in responses:

```text
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination:

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response includes:**

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Sorting

Many endpoints support filtering and sorting:

**Products:**

- `search` - Search term
- `minPrice`, `maxPrice` - Price range
- `brand` - Brand filter
- `categoryId` - Category filter
- `sortBy` - Sort field (price, name, createdAt)
- `sortOrder` - Sort direction (asc, desc)

**Orders:**

- `status` - Order status filter
- `startDate`, `endDate` - Date range
- `sortBy` - Sort field
- `sortOrder` - Sort direction

## Webhooks

### PayU Payment Webhook

The platform receives webhooks from PayU for payment status updates:

**Endpoint:** `POST /payu/notify`

**Payload:**

```json
{
  "order": {
    "orderId": "payu-order-id",
    "status": "COMPLETED",
    "totalAmount": 2099.97
  }
}
```

## Testing

Use the following tools to test the API:

1. **cURL** - Command-line tool
2. **Postman** - API testing tool
3. **Insomnia** - API client
4. **HTTPie** - User-friendly HTTP client

### Example cURL Commands

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Products
curl http://localhost:3001/api/products

# Get Cart (with token)
curl http://localhost:3001/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## SDK Examples

### JavaScript/TypeScript

```typescript
class FlipFlopAPI {
  constructor(private baseUrl: string, private token?: string) {}

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    return response.json();
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.token = response.data.token;
    return response;
  }

  async getProducts(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request(`/products?${params}`);
  }

  async addToCart(productId: string, quantity: number) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }
}

// Usage
const api = new FlipFlopAPI('http://localhost:3001/api');
await api.login('user@example.com', 'password123');
const products = await api.getProducts({ search: 'shoes' });
```

## Support

For API support:

- Check `docs/INTEGRATION_GUIDE.md` for integration patterns
- Review service logs for error details
- Check health endpoints: `GET /health` on each service
