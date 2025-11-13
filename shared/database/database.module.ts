/**
 * Database Module
 * Provides TypeORM database connection for NestJS services
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database.config';
import * as entities from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfig,
      entities: Object.values(entities),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

