import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOrderStatusInput } from './dto/create-order-status.input';
import { UpdateOrderStatusInput } from './dto/update-order-status.input';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusService } from './order-status.service';

@Resolver(() => OrderStatus)
export class OrderStatusResolver {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @Mutation(() => OrderStatus)
  createOrderStatus(
    @Args('createOrderStatusInput')
    createOrderStatusInput: CreateOrderStatusInput,
  ): Promise<OrderStatus> {
    return this.orderStatusService.create(createOrderStatusInput);
  }

  @Query(() => [OrderStatus], { name: 'orderStatus' })
  findAll(): Promise<OrderStatus[]> {
    return this.orderStatusService.findAll();
  }

  @Query(() => OrderStatus, { name: 'orderStatus' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<OrderStatus> {
    return this.orderStatusService.findOne(id);
  }

  @Mutation(() => OrderStatus)
  updateOrderStatus(
    @Args('updateOrderStatusInput')
    updateOrderStatusInput: UpdateOrderStatusInput,
  ): Promise<OrderStatus> {
    return this.orderStatusService.update(
      updateOrderStatusInput.id,
      updateOrderStatusInput,
    );
  }

  @Mutation(() => OrderStatus)
  removeOrderStatus(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.orderStatusService.remove(id);
  }
}
