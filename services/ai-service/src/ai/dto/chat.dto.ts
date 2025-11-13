/**
 * Chat DTO
 */

import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}

