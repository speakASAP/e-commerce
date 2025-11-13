# Invoice Generation and Image Upload Implementation

## ✅ Implementation Complete

Both invoice generation (Items 66-67) and product image upload (Item 56) have been successfully implemented.

---

## 📄 Invoice Generation

### Implementation Details

**Location**: `services/order-service/src/invoices/`

**Files Created**:

- `invoice.service.ts` - Invoice generation service
- `invoices.controller.ts` - Invoice endpoints
- `invoices.module.ts` - Invoice module

### Features

1. **Proforma Invoice Generation**
   - Generated at checkout (before payment)
   - Czech-compliant format
   - PDF generation using pdfkit
   - Unique invoice numbers (PRO-YYYY-XXXXXX)
   - 30-day expiration

2. **Final Invoice Generation**
   - Generated after payment confirmation
   - Czech-compliant format
   - PDF generation using pdfkit
   - Unique invoice numbers (INV-YYYY-XXXXXX)
   - Includes payment date

3. **Invoice PDF Format**
   - Company information (FlipFlop.cz)
   - Customer information
   - Delivery address
   - Itemized list with SKU, quantity, prices
   - Totals (subtotal, tax, shipping, discount, total)
   - Czech language labels

### API Endpoints

#### Generate Proforma Invoice

```text
POST /invoices/proforma/:orderId
Authorization: Bearer <token>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderId": "uuid",
    "proformaNumber": "PRO-2025-000001",
    "fileUrl": "invoices/PRO-PRO-2025-000001.pdf",
    "issuedAt": "2025-01-27T12:00:00.000Z",
    "expiresAt": "2025-02-26T12:00:00.000Z"
  }
}
```

#### Generate Final Invoice

```text
POST /invoices/final/:orderId
Authorization: Bearer <token>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderId": "uuid",
    "invoiceNumber": "INV-2025-000001",
    "fileUrl": "invoices/INV-INV-2025-000001.pdf",
    "issuedAt": "2025-01-27T12:00:00.000Z",
    "paidAt": "2025-01-27T12:00:00.000Z"
  }
}
```

#### Download Proforma Invoice

```text
GET /invoices/proforma/:invoiceId/download
Authorization: Bearer <token>
```

Returns PDF file for download.

#### Download Final Invoice

```text
GET /invoices/final/:invoiceId/download
Authorization: Bearer <token>
```

Returns PDF file for download.

### Usage Example

```typescript
// Generate proforma invoice when order is created
const proformaInvoice = await invoiceService.generateProformaInvoice(orderId);

// Generate final invoice after payment
if (order.paymentStatus === 'paid') {
  const finalInvoice = await invoiceService.generateFinalInvoice(orderId);
}
```

### Storage

- Invoices are stored in `services/order-service/invoices/` directory
- PDF files are named: `PRO-{number}.pdf` or `INV-{number}.pdf`
- Invoice records are stored in database with file paths

### Dependencies

- `pdfkit` - PDF generation
- `@types/pdfkit` - TypeScript types

---

## 🖼️ Product Image Upload

### Implementation Details

**Location**: `services/product-service/src/products/`

**Files Created**:

- `images.service.ts` - Image processing service
- `images.controller.ts` - Image upload endpoints

### Features

1. **File Upload**
   - Multipart/form-data support
   - Memory storage (no temp files)
   - File validation (type, size)
   - Maximum file size: 5MB

2. **Image Processing**
   - Automatic resizing (max 2000px for main, 1000px for others)
   - Format preservation (JPEG, PNG, WebP)
   - Quality optimization (85% quality)
   - Progressive JPEG support

3. **Image Storage**
   - Stored in `uploads/products/` directory
   - Unique filenames: `{productId}-{timestamp}-{random}.{ext}`
   - Static file serving via `/uploads` endpoint

4. **Image Management**
   - Upload main product image
   - Upload additional product images
   - Delete images
   - Automatic URL generation

### API Endpoints

#### Upload Main Product Image

```text
POST /products/:productId/images/main
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- image: File (max 5MB, JPEG/PNG/WebP)
```

**Response**:

```json
{
  "success": true,
  "data": {
    "message": "Main image uploaded successfully",
    "imageUrl": "http://localhost:3001/uploads/products/product-id-1234567890-abc123.jpg",
    "product": { ... }
  }
}
```

#### Upload Additional Product Image

```text
POST /products/:productId/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- image: File (max 5MB, JPEG/PNG/WebP)
```

**Response**:

```json
{
  "success": true,
  "data": {
    "message": "Image uploaded successfully",
    "imageUrl": "http://localhost:3001/uploads/products/product-id-1234567890-xyz789.jpg",
    "product": { ... }
  }
}
```

#### Delete Product Image

```text
DELETE /products/:productId/images/:imageUrl
Authorization: Bearer <token>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "message": "Image deleted successfully"
  }
}
```

### Usage Example

```typescript
// Upload main image
const formData = new FormData();
formData.append('image', file);

await fetch(`/products/${productId}/images/main`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

// Upload additional image
await fetch(`/products/${productId}/images`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### File Validation

- **Allowed types**: JPEG, JPG, PNG, WebP
- **Maximum size**: 5MB
- **Automatic format detection**

### Image Processing

- **Main images**: Max 2000px (width or height)
- **Additional images**: Max 1000px (width or height)
- **Quality**: 85% (optimized for web)
- **Progressive JPEG**: Enabled for better loading

### Storage

- Images stored in `services/product-service/uploads/products/`
- Static files served at `/uploads/products/`
- Full URLs generated automatically

### Dependencies

- `multer` - File upload handling
- `@types/multer` - TypeScript types
- `sharp` - Image processing
- `@nestjs/platform-express` - Express integration

---

## 🔧 Configuration

### Invoice Service

No additional configuration required. Invoice directory is created automatically.

### Image Service

No additional configuration required. Uploads directory is created automatically.

**Optional Environment Variables**:

- `API_URL` - Base URL for image URLs (default: `http://localhost:3001`)

---

## 📝 Integration Notes

### Invoice Generation Integration

Invoices can be automatically generated:

1. **Proforma Invoice**: Generate when order is created

   ```typescript
   // In orders.service.ts after order creation
   await this.invoiceService.generateProformaInvoice(order.id);
   ```

2. **Final Invoice**: Generate when payment is confirmed

   ```typescript
   // In orders.service.ts after payment confirmation
   if (order.paymentStatus === 'paid') {
     await this.invoiceService.generateFinalInvoice(order.id);
   }
   ```

### Image Upload Integration

Images can be uploaded via:

1. **Frontend Form**:

   ```html
   <form enctype="multipart/form-data">
     <input type="file" name="image" accept="image/*" />
     <button type="submit">Upload</button>
   </form>
   ```

2. **API Client**:

   ```typescript
   const formData = new FormData();
   formData.append('image', file);
   await api.post(`/products/${id}/images/main`, formData);
   ```

---

## ✅ Testing Checklist

### Invoice Generation

- [ ] Generate proforma invoice for new order
- [ ] Generate final invoice after payment
- [ ] Download proforma invoice PDF
- [ ] Download final invoice PDF
- [ ] Verify invoice numbers are unique
- [ ] Verify invoice data is correct
- [ ] Verify PDF format is correct

### Image Upload

- [ ] Upload main product image
- [ ] Upload additional product images
- [ ] Delete product image
- [ ] Verify image is resized correctly
- [ ] Verify image quality is optimized
- [ ] Verify image URL is accessible
- [ ] Test with different image formats (JPEG, PNG, WebP)
- [ ] Test file size validation
- [ ] Test file type validation

---

## 🚀 Next Steps

### Invoice Generation

1. Add company ICO and DIC to environment variables
2. Customize invoice template with company logo
3. Add invoice email sending
4. Add invoice history endpoint

### Image Upload

1. Add image CDN integration
2. Add image thumbnail generation
3. Add image compression levels
4. Add bulk image upload
5. Add image cropping/editing

---

## 📚 Related Documentation

- [API Documentation](API_DOCUMENTATION.md)
- [Integration Guide](INTEGRATION_GUIDE.md)
- [Remaining Items from Plan](REMAINING_ITEMS_FROM_PLAN.md)

---

**Status**: ✅ **COMPLETE**  
**Date**: 2025-01-27
