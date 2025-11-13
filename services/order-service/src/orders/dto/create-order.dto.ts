/**
 * Create Order DTO
 */

import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  deliveryAddressId: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  shippingCost?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;
}

