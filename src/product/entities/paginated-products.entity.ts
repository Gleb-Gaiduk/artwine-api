import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../utils/paginate/entities/pagination-result.entity';
import { Product } from './product.entity';

@ObjectType()
export class PaginatedProducts extends PaginatedResponse(Product) {}
