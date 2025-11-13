/**
 * Product Entity
 * Product master data
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductVariant } from './product-variant.entity';
import { SupplierProduct } from './supplier-product.entity';
import { OrderItem } from './order-item.entity';
import { CartItem } from './cart-item.entity';

@Entity('products')
@Index(['sku'], { unique: true })
@Index(['name'])
@Index(['isActive'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  compareAtPrice: number; // Original price for discounts

  @Column({ type: 'varchar', length: 500, nullable: true })
  mainImageUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  imageUrls: string[]; // Array of image URLs

  @Column({ type: 'jsonb', nullable: true })
  videoUrls: string[]; // Array of video URLs

  @Column({ type: 'integer', default: 0 })
  stockQuantity: number;

  @Column({ type: 'boolean', default: false })
  trackInventory: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  manufacturer: string;

  @Column({ type: 'jsonb', nullable: true })
  attributes: Record<string, any>; // Flexible product attributes for filtering

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rating: number; // Average rating (0-5)

  @Column({ type: 'integer', default: 0 })
  reviewCount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  seoTitle: string;

  @Column({ type: 'text', nullable: true })
  seoDescription: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  seoKeywords: string;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => SupplierProduct, (supplierProduct) => supplierProduct.product)
  supplierProducts: SupplierProduct[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

