/**
 * Images Service
 * Handles product image upload, storage, and processing
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class ImagesService {
  private readonly uploadsDir: string;
  private readonly maxFileSize: number = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes: string[] = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  constructor(private configService: ConfigService) {
    // Create uploads directory if it doesn't exist
    this.uploadsDir = path.join(process.cwd(), 'uploads', 'products');
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Validate uploaded file
   */
  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }
  }

  /**
   * Process and save image
   */
  async processAndSaveImage(
    file: Express.Multer.File,
    productId: string,
    isMain: boolean = false,
  ): Promise<string> {
    this.validateFile(file);

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${productId}-${timestamp}-${randomString}${fileExtension}`;
    const filePath = path.join(this.uploadsDir, fileName);

    try {
      // Process image with sharp
      const image = sharp(file.buffer);

      // Get image metadata
      const metadata = await image.metadata();

      // Resize if needed (max 2000px width/height for main, 1000px for others)
      const maxDimension = isMain ? 2000 : 1000;
      let processedImage = image;

      if (metadata.width && metadata.width > maxDimension) {
        processedImage = processedImage.resize(maxDimension, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      } else if (metadata.height && metadata.height > maxDimension) {
        processedImage = processedImage.resize(null, maxDimension, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      }

      // Optimize and save based on original format
      if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
        await processedImage.jpeg({ quality: 85, progressive: true }).toFile(filePath);
      } else if (metadata.format === 'png') {
        await processedImage.png({ quality: 85, compressionLevel: 9 }).toFile(filePath);
      } else if (metadata.format === 'webp') {
        await processedImage.webp({ quality: 85 }).toFile(filePath);
      } else {
        // Default to JPEG
        await processedImage.jpeg({ quality: 85, progressive: true }).toFile(filePath);
      }

      // Return relative URL path
      return `/uploads/products/${fileName}`;
    } catch (error: any) {
      throw new BadRequestException(`Failed to process image: ${error.message}`);
    }
  }

  /**
   * Delete image file
   */
  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) {
      return;
    }

    // Extract filename from URL
    const fileName = path.basename(imageUrl);
    const filePath = path.join(this.uploadsDir, fileName);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error: any) {
        // Log error but don't throw (file might not exist)
        console.error(`Failed to delete image file: ${filePath}`, error);
      }
    }
  }

  /**
   * Delete multiple image files
   */
  async deleteImages(imageUrls: string[]): Promise<void> {
    for (const url of imageUrls) {
      await this.deleteImage(url);
    }
  }

  /**
   * Get full URL for image
   */
  getImageUrl(relativePath: string): string {
    if (!relativePath) {
      return null;
    }

    // If already a full URL, return as is
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }

    // Get base URL from config or use default
    const baseUrl =
      this.configService.get<string>('API_URL') || 'http://localhost:3001';
    return `${baseUrl}${relativePath}`;
  }
}
