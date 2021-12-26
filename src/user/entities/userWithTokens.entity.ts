import { ObjectType, PartialType } from '@nestjs/graphql';
import { Tokens } from '../../auth/entities/tokens.entity';
import { User } from './user.entity';

@ObjectType()
export class UserWithTokens extends PartialType(User) {
  auth: Tokens;
}
