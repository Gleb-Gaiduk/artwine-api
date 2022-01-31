import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../utils/paginate/entities/pagination-result.entity';
import { Order } from './order.entity';

@ObjectType()
export class PaginatedOrders extends PaginatedResponse(Order) {}
