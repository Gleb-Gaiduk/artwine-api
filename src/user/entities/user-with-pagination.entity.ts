import { ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class UserWithPagination {
  data: User[];
  total: number;
}
