# Database Schema Documentation

## Overview

The e-commerce platform uses PostgreSQL database hosted in the separate `../database-server` microservice. All tables are designed to support the MVP requirements with extensibility for future features.

## Database Connection

- **Host**: `db-server-postgres` (Docker container name)
- **Port**: `5432`
- **Network**: `nginx-network` (external Docker network)
- **Database Name**: `ecommerce` (configurable via `DB_NAME` env variable)

## Entity Relationships

```text
User
├── DeliveryAddress (one-to-many)
├── Order (one-to-many)
└── CartItem (one-to-many)

Product
├── ProductVariant (one-to-many)
├── Category (many-to-many via product_categories)
├── SupplierProduct (one-to-many)
├── OrderItem (one-to-many)
└── CartItem (one-to-many)

Order
├── OrderItem (one-to-many)
├── OrderStatusHistory (one-to-many)
├── Invoice (one-to-many)
├── ProformaInvoice (one-to-many)
├── User (many-to-one)
└── DeliveryAddress (many-to-one)

Supplier
└── SupplierProduct (one-to-many)
```

## Tables

### users

User accounts and authentication.

**Columns:**

- `id` (UUID, PK)
- `email` (VARCHAR(255), UNIQUE, INDEXED)
- `password` (VARCHAR(255)) - Hashed password
- `firstName` (VARCHAR(100))
- `lastName` (VARCHAR(100))
- `phone` (VARCHAR(20))
- `isEmailVerified` (BOOLEAN, default: false)
- `isAdmin` (BOOLEAN, default: false)
- `preferences` (JSONB) - User preferences
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Unique index on `email`

### categories

Product categories with support for nested categories.

**Columns:**

- `id` (UUID, PK)
- `name` (VARCHAR(255))
- `slug` (VARCHAR(255), UNIQUE, INDEXED)
- `description` (TEXT)
- `imageUrl` (VARCHAR(500))
- `parentId` (UUID) - For nested categories
- `sortOrder` (INTEGER, default: 0)
- `isActive` (BOOLEAN, default: true)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Unique index on `slug`

### products

Product master data with comprehensive attributes.

**Columns:**

- `id` (UUID, PK)
- `name` (VARCHAR(255), INDEXED)
- `sku` (VARCHAR(255), UNIQUE, INDEXED)
- `description` (TEXT)
- `shortDescription` (TEXT)
- `price` (DECIMAL(10,2))
- `compareAtPrice` (DECIMAL(10,2)) - Original price for discounts
- `mainImageUrl` (VARCHAR(500))
- `imageUrls` (JSONB) - Array of image URLs
- `videoUrls` (JSONB) - Array of video URLs
- `stockQuantity` (INTEGER, default: 0)
- `trackInventory` (BOOLEAN, default: false)
- `isActive` (BOOLEAN, default: true, INDEXED)
- `brand` (VARCHAR(100))
- `manufacturer` (VARCHAR(100))
- `attributes` (JSONB) - Flexible product attributes for filtering
- `rating` (DECIMAL(5,2)) - Average rating (0-5)
- `reviewCount` (INTEGER, default: 0)
- `seoTitle` (VARCHAR(255))
- `seoDescription` (TEXT)
- `seoKeywords` (VARCHAR(255))
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Unique index on `sku`
- Index on `name`
- Index on `isActive`

### product_variants

Product variants (colors, sizes, etc.).

**Columns:**

- `id` (UUID, PK)
- `productId` (UUID, FK to products)
- `sku` (VARCHAR(255))
- `name` (VARCHAR(100)) - e.g., "Red / Large"
- `options` (JSONB) - e.g., { color: "red", size: "large" }
- `price` (DECIMAL(10,2))
- `compareAtPrice` (DECIMAL(10,2))
- `stockQuantity` (INTEGER, default: 0)
- `imageUrl` (VARCHAR(500))
- `isActive` (BOOLEAN, default: true)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Unique composite index on (`productId`, `sku`)

### suppliers

Supplier information and API configuration.

**Columns:**

- `id` (UUID, PK)
- `name` (VARCHAR(255), INDEXED)
- `contactEmail` (VARCHAR(255))
- `contactPhone` (VARCHAR(50))
- `address` (TEXT)
- `apiUrl` (VARCHAR(100))
- `apiKey` (VARCHAR(255))
- `apiSecret` (VARCHAR(255))
- `apiConfig` (JSONB) - Additional API configuration
- `isActive` (BOOLEAN, default: true)
- `autoSyncProducts` (BOOLEAN, default: false)
- `autoForwardOrders` (BOOLEAN, default: false)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Index on `name`

### supplier_products

Supplier product mappings with pricing and stock information.

**Columns:**

- `id` (UUID, PK)
- `supplierId` (UUID, FK to suppliers)
- `productId` (UUID, FK to products)
- `supplierSku` (VARCHAR(255)) - SKU from supplier
- `supplierPrice` (DECIMAL(10,2)) - Price from supplier
- `profitMargin` (DECIMAL(5,2)) - Profit margin percentage
- `supplierStock` (INTEGER) - Stock from supplier
- `supplierData` (JSONB) - Additional supplier-specific data
- `lastSyncedAt` (TIMESTAMP)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Unique composite index on (`supplierId`, `supplierSku`)

### cart_items

Shopping cart items.

**Columns:**

- `id` (UUID, PK)
- `userId` (UUID, FK to users)
- `productId` (UUID, FK to products)
- `variantId` (UUID, FK to product_variants, nullable)
- `quantity` (INTEGER)
- `price` (DECIMAL(10,2)) - Price at time of adding to cart
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Unique composite index on (`userId`, `productId`, `variantId`)

### orders

Order master table.

**Columns:**

- `id` (UUID, PK)
- `orderNumber` (VARCHAR(50), UNIQUE, INDEXED) - e.g., ORD-2025-001234
- `userId` (UUID, FK to users, INDEXED)
- `deliveryAddressId` (UUID, FK to delivery_addresses)
- `status` (ENUM, INDEXED) - pending, confirmed, processing, shipped, delivered, cancelled, refunded
- `paymentStatus` (ENUM) - pending, paid, failed, refunded
- `paymentMethod` (VARCHAR(50)) - e.g., 'payu', 'card', 'bank_transfer'
- `paymentTransactionId` (VARCHAR(255))
- `subtotal` (DECIMAL(10,2))
- `tax` (DECIMAL(10,2), default: 0)
- `shippingCost` (DECIMAL(10,2), default: 0)
- `discount` (DECIMAL(10,2), default: 0)
- `total` (DECIMAL(10,2))
- `trackingNumber` (VARCHAR(100))
- `shippingProvider` (VARCHAR(255))
- `notes` (TEXT)
- `metadata` (JSONB) - Additional order data
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Unique index on `orderNumber`
- Index on `userId`
- Index on `status`

### order_items

Order line items with product snapshots.

**Columns:**

- `id` (UUID, PK)
- `orderId` (UUID, FK to orders, INDEXED)
- `productId` (UUID, FK to products)
- `variantId` (UUID, FK to product_variants, nullable)
- `productName` (VARCHAR(255)) - Snapshot at time of order
- `productSku` (VARCHAR(255)) - Snapshot at time of order
- `quantity` (INTEGER)
- `unitPrice` (DECIMAL(10,2)) - Price at time of order
- `totalPrice` (DECIMAL(10,2)) - quantity * unitPrice
- `profitMargin` (DECIMAL(10,2)) - Profit margin for this item
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Index on `orderId`

### order_status_history

Order status tracking history.

**Columns:**

- `id` (UUID, PK)
- `orderId` (UUID, FK to orders, INDEXED)
- `status` (ENUM) - Order status
- `notes` (TEXT)
- `changedBy` (VARCHAR(100)) - User ID or system
- `createdAt` (TIMESTAMP)

**Indexes:**

- Index on `orderId`

### delivery_addresses

Customer delivery addresses.

**Columns:**

- `id` (UUID, PK)
- `userId` (UUID, FK to users, INDEXED)
- `firstName` (VARCHAR(100))
- `lastName` (VARCHAR(100))
- `street` (VARCHAR(255))
- `city` (VARCHAR(100))
- `postalCode` (VARCHAR(20))
- `country` (VARCHAR(100)) - Czech Republic
- `phone` (VARCHAR(50))
- `isDefault` (BOOLEAN, default: false)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Index on `userId`

### invoices

Final invoices after payment and shipment.

**Columns:**

- `id` (UUID, PK)
- `orderId` (UUID, FK to orders, INDEXED)
- `invoiceNumber` (VARCHAR(50), UNIQUE, INDEXED) - e.g., INV-2025-001234
- `fileUrl` (VARCHAR(500)) - Path to generated PDF invoice
- `invoiceData` (JSONB) - Full invoice data in JSON format
- `issuedAt` (TIMESTAMP)
- `paidAt` (TIMESTAMP, nullable)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Unique index on `invoiceNumber`
- Index on `orderId`

### proforma_invoices

Proforma invoices at checkout (before payment).

**Columns:**

- `id` (UUID, PK)
- `orderId` (UUID, FK to orders, INDEXED)
- `proformaNumber` (VARCHAR(50), UNIQUE, INDEXED) - e.g., PRO-2025-001234
- `fileUrl` (VARCHAR(500)) - Path to generated PDF proforma invoice
- `invoiceData` (JSONB) - Full proforma invoice data in JSON format
- `issuedAt` (TIMESTAMP)
- `expiresAt` (TIMESTAMP) - Proforma invoices typically expire
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Unique index on `proformaNumber`
- Index on `orderId`

### payment_methods

Payment method preferences.

**Columns:**

- `id` (UUID, PK)
- `userId` (UUID, FK to users, INDEXED)
- `type` (VARCHAR(50)) - e.g., 'payu', 'card', 'bank_transfer'
- `provider` (VARCHAR(255)) - Payment provider name
- `metadata` (JSONB) - Payment method specific data (masked)
- `isDefault` (BOOLEAN, default: false)
- `isActive` (BOOLEAN, default: true)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**

- Index on `userId`

### product_categories

Many-to-many relationship table between products and categories.

**Columns:**

- `productId` (UUID, FK to products)
- `categoryId` (UUID, FK to categories)

## Migration Strategy

1. Use TypeORM migrations for schema changes
2. Run migrations: `npm run typeorm:migration:run`
3. Generate migrations: `npm run typeorm:migration:generate -- -n MigrationName`
4. Revert migrations: `npm run typeorm:migration:revert`

## Notes

- All monetary values use `DECIMAL(10,2)` for precision
- UUIDs are used for all primary keys
- Timestamps are automatically managed by TypeORM
- JSONB columns allow flexible schema extensions
- Indexes are optimized for common query patterns
- Foreign keys use CASCADE or SET NULL appropriately
