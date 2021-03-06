import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Connection } from 'typeorm';
import { EntityQueryInput } from '../utils/dto/entity-query.input';
import { CreateOrderInput } from './dto/create-order.input';
import { Order } from './entities/order.entity';
import { PaginatedOrders } from './entities/paginated-orders.entity';
import { OrderService } from './order.service';

@Resolver(() => Order)
// @UseGuards(PoliciesGuard)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private connection: Connection,
  ) {}

  @Mutation(() => Order)
  // @CheckPolicies(ManageOrderPolicyHandler)
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ): Promise<Order> {
    return this.connection.transaction(async (transactionEntityManager) => {
      return await this.orderService
        .withTransaction(transactionEntityManager)
        .create(createOrderInput);
    });
  }

  @Query(() => PaginatedOrders, { name: 'orders' })
  // @CheckPolicies(ManageOrderPolicyHandler)
  findAll(
    @Args('options', {
      nullable: true,
    })
    options?: EntityQueryInput,
  ): Promise<PaginatedOrders> {
    return this.orderService.findAll(options);
  }

  @Query(() => Order, { name: 'order' })
  // @CheckPolicies(ManageOrderPolicyHandler)
  findOne(@Args('id') id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  // @Mutation(() => Order)
  // updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
  //   return this.orderService.update(updateOrderInput.id, updateOrderInput);
  // }

  @Mutation(() => Boolean)
  // @CheckPolicies(ManageOrderPolicyHandler)
  removeOrder(@Args('id') id: string): Promise<boolean> {
    return this.orderService.remove(id);
  }
}
