/**
 * Supplier Product Entity
 * Supplier product mappings
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { Product } from './product.entity';

@Entity('supplier_products')
@Index(['supplierId', 'supplierSku'], { unique: true })
export class SupplierProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  supplierId: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.supplierProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.supplierProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  supplierSku: string; // SKU from supplier

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  supplierPrice: number; // Price from supplier

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  profitMargin: number; // Profit margin percentage

  @Column({ type: 'integer', nullable: true })
  supplierStock: number; // Stock from supplier

  @Column({ type: 'jsonb', nullable: true })
  supplierData: Record<string, any>; // Additional supplier-specific data

  @Column({ type: 'timestamp', nullable: true })
  lastSyncedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

