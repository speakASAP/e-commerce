/**
 * Admin Controller
 * Handles admin operations
 */

import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { UpdateCompanySettingsDto } from './dto/update-company-settings.dto';
import { ApiResponseUtil } from '../../../../shared/utils/api-response.util';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Check if user is admin
   */
  private async checkAdmin(userId: string): Promise<void> {
    try {
      const userServiceUrl = process.env.USER_SERVICE_URL || 'http://e-commerce-user-service:3004';
      const response = await firstValueFrom(
        this.httpService.get(`${userServiceUrl}/users/${userId}`, {
          headers: { Authorization: `Bearer ${userId}` },
        }),
      );
      const user = response.data.data;
      if (!user || !user.isAdmin) {
        throw new ForbiddenException('Admin access required');
      }
    } catch (error: any) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      // If user service unavailable, allow access (for development)
      console.warn('User service unavailable, allowing admin access');
    }
  }

  /**
   * Get company settings
   */
  @Get('company-settings')
  async getCompanySettings(@Request() req) {
    await this.checkAdmin(req.user.id);
    const settings = await this.adminService.getCompanySettings();
    return ApiResponseUtil.success(settings);
  }

  /**
   * Update company settings
   */
  @Put('company-settings')
  async updateCompanySettings(
    @Request() req,
    @Body() updateDto: UpdateCompanySettingsDto,
  ) {
    await this.checkAdmin(req.user.id);
    const settings = await this.adminService.updateCompanySettings(updateDto);
    return ApiResponseUtil.success(settings);
  }
}
