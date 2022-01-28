import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Connection } from 'typeorm';
import { CreateOrderInput } from './dto/create-order.input';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private connection: Connection,
  ) {}

  @Mutation(() => Order)
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ): Promise<Order> {
    return this.connection.transaction(async (transactionEntityManager) => {
      return await this.orderService
        .withTransaction(transactionEntityManager)
        .create(createOrderInput);
    });
  }

  // @Query(() => [Order], { name: 'order' })
  // findAll() {
  //   return this.orderService.findAll();
  // }

  // @Query(() => Order, { name: 'order' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.orderService.findOne(id);
  // }

  // @Mutation(() => Order)
  // updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
  //   return this.orderService.update(updateOrderInput.id, updateOrderInput);
  // }

  // @Mutation(() => Order)
  // removeOrder(@Args('id', { type: () => Int }) id: number) {
  //   return this.orderService.remove(id);
  // }
}
