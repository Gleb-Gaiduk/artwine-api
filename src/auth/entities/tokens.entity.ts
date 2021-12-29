import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Tokens {
  access_token: string;
  refresh_token: string;
}

@ObjectType()
export class JwtAccessTokenPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

@ObjectType()
export class JwtRefreshTokenPayload extends JwtAccessTokenPayload {
  refreshToken: string;
}
