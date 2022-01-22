import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class Tokens {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;
}
