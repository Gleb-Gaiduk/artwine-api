import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTValidatePayload, PassportStrategyName } from './types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyName.JWT_REFRESH,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JWTValidatePayload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
