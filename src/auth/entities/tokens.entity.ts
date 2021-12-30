import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Tokens {
  access_token: string;
  refresh_token: string;
}
