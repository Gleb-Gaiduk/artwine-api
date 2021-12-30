import { OmitType } from '@nestjs/graphql';
import { JwtAccessTokenInput } from '../dto/jwtToken.input';

export enum PassportStrategyName {
  JWT = 'jwt',
  JWT_REFRESH = 'jwt-refresh',
}

export class JWTValidatePayload extends OmitType(JwtAccessTokenInput, [
  'iat',
  'exp',
] as const) {}
