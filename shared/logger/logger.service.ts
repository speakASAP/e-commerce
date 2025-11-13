/**
 * Logger Service
 * NestJS service wrapper for centralized logger
 */

import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ILogger } from '../interfaces/logger.interface';
import loggerUtil from './logger.util';

@Injectable()
export class LoggerService implements NestLoggerService, ILogger {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  async error(message: string, traceOrMetadata?: string | Record<string, any>, context?: string): Promise<void> {
    const metadata: Record<string, any> = {};
    if (typeof traceOrMetadata === 'object' && traceOrMetadata !== null) {
      Object.assign(metadata, traceOrMetadata);
    } else if (traceOrMetadata) {
      metadata.trace = traceOrMetadata;
    }
    if (context || this.context) metadata.context = context || this.context;
    await loggerUtil.error(message, metadata);
  }

  async warn(message: string, contextOrMetadata?: string | Record<string, any>): Promise<void> {
    const metadata: Record<string, any> = {};
    if (typeof contextOrMetadata === 'object' && contextOrMetadata !== null) {
      Object.assign(metadata, contextOrMetadata);
    } else if (contextOrMetadata) {
      metadata.context = contextOrMetadata;
    }
    if (this.context) metadata.context = this.context;
    await loggerUtil.warn(message, metadata);
  }

  async log(message: string, contextOrMetadata?: string | Record<string, any>): Promise<void> {
    const metadata: Record<string, any> = {};
    if (typeof contextOrMetadata === 'object' && contextOrMetadata !== null) {
      Object.assign(metadata, contextOrMetadata);
    } else if (contextOrMetadata) {
      metadata.context = contextOrMetadata;
    }
    if (this.context) metadata.context = this.context;
    await loggerUtil.info(message, metadata);
  }

  async info(message: string, metadata?: Record<string, any>): Promise<void> {
    const logMetadata: Record<string, any> = metadata || {};
    if (this.context) logMetadata.context = this.context;
    await loggerUtil.info(message, logMetadata);
  }

  async debug(message: string, metadata?: Record<string, any>): Promise<void> {
    const logMetadata: Record<string, any> = metadata || {};
    if (this.context) logMetadata.context = this.context;
    await loggerUtil.debug(message, logMetadata);
  }

  async verbose(message: string, context?: string): Promise<void> {
    const metadata: Record<string, any> = {};
    if (context || this.context) metadata.context = context || this.context;
    await this.debug(message, metadata);
  }
}
