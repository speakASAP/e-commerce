/**
 * JWT Strategy for Passport
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private httpService: HttpService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    // Validate user via User Service
    try {
      const userServiceUrl = process.env.USER_SERVICE_URL || 'http://e-commerce-user-service:3004';
      const response = await firstValueFrom(
        this.httpService.get(`${userServiceUrl}/users/${payload.sub}`, {
          headers: { Authorization: `Bearer ${payload.sub}` },
        }),
      );
      return response.data.data;
    } catch (error) {
      // Fallback to payload if service unavailable
      return { id: payload.sub, email: payload.email };
    }
  }
}
