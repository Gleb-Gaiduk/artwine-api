import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Tokens {
  access_token: string;
  refresh_token: string;
}

@ObjectType()
export class JwtTokenPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}
