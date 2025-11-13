# Image Upload Testing Guide

## Test Image Upload with Various File Types

This guide provides test cases and examples for testing the product image upload functionality.

---

## Test Cases

### 1. Upload Main Product Image (JPEG)

**Endpoint**: `POST /api/products/:productId/images/main`

**Request**:

```bash
curl -X POST \
  http://localhost:3001/api/products/{productId}/images/main \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/test-image.jpg"
```

**Expected Response**:

```json
{
  "success": true,
  "data": {
    "message": "Main image uploaded successfully",
    "imageUrl": "http://localhost:3001/uploads/products/product-id-1234567890-abc123.jpg",
    "product": {
      "id": "...",
      "mainImageUrl": "http://localhost:3001/uploads/products/product-id-1234567890-abc123.jpg",
      ...
    }
  }
}
```

**Test Files**:

- Small JPEG (< 1MB)
- Large JPEG (3-5MB)
- High resolution JPEG (4000x3000px)

---

### 2. Upload Additional Product Image (PNG)

**Endpoint**: `POST /api/products/:productId/images`

**Request**:

```bash
curl -X POST \
  http://localhost:3001/api/products/{productId}/images \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/test-image.png"
```

**Expected Response**:

```json
{
  "success": true,
  "data": {
    "message": "Image uploaded successfully",
    "imageUrl": "http://localhost:3001/uploads/products/product-id-1234567890-xyz789.png",
    "product": {
      "id": "...",
      "imageUrls": [
        "http://localhost:3001/uploads/products/product-id-1234567890-xyz789.png"
      ],
      ...
    }
  }
}
```

**Test Files**:

- PNG with transparency
- PNG without transparency
- Large PNG file

---

### 3. Upload WebP Image

**Endpoint**: `POST /api/products/:productId/images`

**Request**:

```bash
curl -X POST \
  http://localhost:3001/api/products/{productId}/images \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/test-image.webp"
```

**Expected Behavior**:

- WebP image should be accepted
- Image should be processed and saved
- URL should be returned

---

### 4. Test File Size Validation

**Test Case**: Upload file larger than 5MB

**Request**:

```bash
curl -X POST \
  http://localhost:3001/api/products/{productId}/images/main \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/large-image.jpg"
```

**Expected Response**:

```json
{
  "success": false,
  "message": "File size exceeds maximum allowed size of 5MB"
}
```

---

### 5. Test File Type Validation

**Test Case**: Upload unsupported file type (e.g., PDF, GIF)

**Request**:

```bash
curl -X POST \
  http://localhost:3001/api/products/{productId}/images/main \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/document.pdf"
```

**Expected Response**:

```json
{
  "success": false,
  "message": "Invalid file type. Allowed types: image/jpeg, image/jpg, image/png, image/webp"
}
```

---

### 6. Test Image Resizing

**Test Case**: Upload very large image (4000x3000px)

**Expected Behavior**:

- Main image: Resized to max 2000px (width or height)
- Additional image: Resized to max 1000px (width or height)
- Aspect ratio preserved
- Image quality maintained

---

### 7. Test Image Optimization

**Expected Behavior**:

- JPEG images: Progressive encoding enabled
- PNG images: Compression level 9
- WebP images: Quality 85%
- File size reduced while maintaining quality

---

### 8. Delete Image

**Endpoint**: `DELETE /api/products/:productId/images/:imageUrl`

**Request**:

```bash
curl -X DELETE \
  "http://localhost:3001/api/products/{productId}/images/{encodedImageUrl}" \
  -H "Authorization: Bearer {token}"
```

**Expected Response**:

```json
{
  "success": true,
  "data": {
    "message": "Image deleted successfully"
  }
}
```

**Expected Behavior**:

- Image removed from product's imageUrls array
- If main image, mainImageUrl set to null
- File deleted from disk

---

## Test Script

Create test images for testing:

```bash
# Create test directory
mkdir -p test-images

# Create test JPEG (using ImageMagick or similar)
convert -size 2000x1500 xc:blue test-images/test-jpeg.jpg

# Create test PNG
convert -size 1000x1000 xc:red test-images/test-png.png

# Create test WebP
convert -size 1500x1200 xc:green test-images/test-webp.webp

# Create large test image (for size validation)
convert -size 6000x4000 xc:yellow test-images/large-image.jpg
```

---

## Manual Testing Checklist

- [ ] Upload JPEG main image
- [ ] Upload PNG additional image
- [ ] Upload WebP image
- [ ] Upload large image (> 5MB) - should fail
- [ ] Upload unsupported format (PDF, GIF) - should fail
- [ ] Upload very large resolution image - should be resized
- [ ] Verify image is accessible via URL
- [ ] Delete main image
- [ ] Delete additional image
- [ ] Verify file is deleted from disk
- [ ] Test with multiple images for same product
- [ ] Verify image quality after processing

---

## Expected Image Processing Results

### Main Images

- **Max dimension**: 2000px
- **Format**: Preserved (JPEG/PNG/WebP)
- **Quality**: 85%
- **Progressive**: Yes (for JPEG)

### Additional Images

- **Max dimension**: 1000px
- **Format**: Preserved (JPEG/PNG/WebP)
- **Quality**: 85%
- **Progressive**: Yes (for JPEG)

---

## Troubleshooting

### Image not accessible

- Check if static file serving is enabled in `main.ts`
- Verify file exists in `uploads/products/` directory
- Check file permissions

### Image processing fails

- Verify Sharp is installed correctly
- Check available disk space
- Review error logs

### File upload fails

- Check file size (max 5MB)
- Verify file type is supported
- Check authentication token

---

**Status**: Ready for Testing
