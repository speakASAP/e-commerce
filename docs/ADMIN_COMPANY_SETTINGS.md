# Admin Company Settings

## Overview

Company settings allow administrators to configure company information that appears on invoices and other business documents. This includes IČO (Company Registration Number), DIČ (VAT Number), address, contact information, and more.

---

## API Endpoints

### Get Company Settings

**Endpoint**: `GET /api/admin/company-settings`

**Authentication**: Required (Admin only)

**Request**:

```bash
curl -X GET \
  http://localhost:3001/api/admin/company-settings \
  -H "Authorization: Bearer {admin_token}"
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "FlipFlop.cz",
    "address": "Czech Republic",
    "city": null,
    "postalCode": null,
    "country": "Česká republika",
    "ico": "12345678",
    "dic": "CZ12345678",
    "phone": "+420 123 456 789",
    "email": "info@flipflop.cz",
    "website": "https://flipflop.cz",
    "logoUrl": null,
    "notes": null,
    "createdAt": "2025-01-27T12:00:00.000Z",
    "updatedAt": "2025-01-27T12:00:00.000Z"
  }
}
```

---

### Update Company Settings

**Endpoint**: `PUT /api/admin/company-settings`

**Authentication**: Required (Admin only)

**Request**:

```bash
curl -X PUT \
  http://localhost:3001/api/admin/company-settings \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "FlipFlop.cz s.r.o.",
    "address": "Václavské náměstí 1",
    "city": "Praha",
    "postalCode": "110 00",
    "country": "Česká republika",
    "ico": "12345678",
    "dic": "CZ12345678",
    "phone": "+420 123 456 789",
    "email": "info@flipflop.cz",
    "website": "https://flipflop.cz"
  }'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "FlipFlop.cz s.r.o.",
    "address": "Václavské náměstí 1",
    "city": "Praha",
    "postalCode": "110 00",
    "country": "Česká republika",
    "ico": "12345678",
    "dic": "CZ12345678",
    "phone": "+420 123 456 789",
    "email": "info@flipflop.cz",
    "website": "https://flipflop.cz",
    "logoUrl": null,
    "notes": null,
    "createdAt": "2025-01-27T12:00:00.000Z",
    "updatedAt": "2025-01-27T12:00:00.000Z"
  }
}
```

---

## Default Settings

When company settings are first accessed, default values are automatically created:

- **Name**: `FlipFlop.cz`
- **Address**: `Czech Republic`
- **Country**: `Česká republika`
- **IČO**: `12345678` (test value)
- **DIČ**: `CZ12345678` (test value)
- **Phone**: `+420 123 456 789`
- **Email**: `info@flipflop.cz`
- **Website**: `https://flipflop.cz`

---

## Field Descriptions

### Required Fields

None - all fields are optional, but IČO and DIČ are recommended for Czech invoices.

### Field Details

- **name**: Company name (e.g., "FlipFlop.cz s.r.o.")
- **address**: Street address
- **city**: City name
- **postalCode**: Postal/ZIP code
- **country**: Country name (default: "Česká republika")
- **ico**: IČO (Company Registration Number) - 8 digits for Czech companies
- **dic**: DIČ (VAT Number) - Format: CZ + 8-10 digits
- **phone**: Contact phone number
- **email**: Contact email address
- **website**: Company website URL
- **logoUrl**: URL to company logo (for future use in invoices)
- **notes**: Additional notes

---

## Usage in Invoices

Company settings are automatically used when generating invoices:

1. **Proforma Invoices**: Company info from settings
2. **Final Invoices**: Company info from settings

The invoice PDF will display:

- Company name
- Address (if provided)
- City and postal code (if provided)
- IČO (if provided)
- DIČ (if provided)
- Phone (if provided)
- Email (if provided)

---

## Test Company Settings

For testing purposes, use these test values:

```json
{
  "name": "FlipFlop.cz s.r.o.",
  "address": "Václavské náměstí 1",
  "city": "Praha",
  "postalCode": "110 00",
  "country": "Česká republika",
  "ico": "12345678",
  "dic": "CZ12345678",
  "phone": "+420 123 456 789",
  "email": "info@flipflop.cz",
  "website": "https://flipflop.cz"
}
```

---

## Admin Access

Only users with `isAdmin: true` can access these endpoints. The system checks admin status via the User Service.

**Note**: In development, if the User Service is unavailable, access is allowed for testing purposes.

---

## Database

Company settings are stored in the `company_settings` table. Only one record exists (singleton pattern).

---

## Integration

### Invoice Generation

The invoice service automatically retrieves company settings when generating invoices:

```typescript
// In invoice.service.ts
const companySettings = await this.companySettingsRepository.findOne({...});
// Company info is included in invoice PDF
```

### Future Enhancements

- Logo upload for company settings
- Multiple company profiles
- Invoice template customization
- Email signature configuration

---

**Status**: ✅ **IMPLEMENTED**  
**Date**: 2025-01-27
