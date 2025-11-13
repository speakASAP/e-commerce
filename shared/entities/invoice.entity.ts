/**
 * Invoice Entity
 * Invoice records (final invoices after payment)
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
import { Order } from './order.entity';

@Entity('invoices')
@Index(['invoiceNumber'], { unique: true })
@Index(['orderId'])
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'varchar', length: 50, unique: true })
  invoiceNumber: string; // e.g., INV-2025-001234

  @Column({ type: 'varchar', length: 500, nullable: true })
  fileUrl: string; // Path to generated PDF invoice

  @Column({ type: 'jsonb' })
  invoiceData: Record<string, any>; // Full invoice data in JSON format

  @Column({ type: 'timestamp' })
  issuedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

