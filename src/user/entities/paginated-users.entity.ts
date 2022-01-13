import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from 'src/utils/paginate/entities/pagination-result.entity';
import { User } from './user.entity';

@ObjectType()
export class PaginatedUsers extends PaginatedResponse(User) {}
