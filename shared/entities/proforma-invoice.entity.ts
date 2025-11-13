/**
 * Proforma Invoice Entity
 * Proforma invoice records (at checkout, before payment)
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

@Entity('proforma_invoices')
@Index(['proformaNumber'], { unique: true })
@Index(['orderId'])
export class ProformaInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.proformaInvoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'varchar', length: 50, unique: true })
  proformaNumber: string; // e.g., PRO-2025-001234

  @Column({ type: 'varchar', length: 500, nullable: true })
  fileUrl: string; // Path to generated PDF proforma invoice

  @Column({ type: 'jsonb' })
  invoiceData: Record<string, any>; // Full proforma invoice data in JSON format

  @Column({ type: 'timestamp' })
  issuedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // Proforma invoices typically expire

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

