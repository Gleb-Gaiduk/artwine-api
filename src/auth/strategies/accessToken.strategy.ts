import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTValidatePayload, PassportStrategyName } from './types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyName.JWT,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: JWTValidatePayload) {
    return payload;
  }
}
