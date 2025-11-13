/**
 * Supplier Entity
 * Supplier information
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { SupplierProduct } from './supplier-product.entity';

@Entity('suppliers')
@Index(['name'])
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactEmail: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contactPhone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apiUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  apiKey: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  apiSecret: string;

  @Column({ type: 'jsonb', nullable: true })
  apiConfig: Record<string, any>; // Additional API configuration

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  autoSyncProducts: boolean;

  @Column({ type: 'boolean', default: false })
  autoForwardOrders: boolean;

  @OneToMany(() => SupplierProduct, (supplierProduct) => supplierProduct.supplier)
  supplierProducts: SupplierProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

