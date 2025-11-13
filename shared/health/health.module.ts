/**
 * Health Check Module
 * Provides health check functionality for services
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { HealthService } from './health.service';

@Module({
  imports: [TypeOrmModule, HttpModule],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
