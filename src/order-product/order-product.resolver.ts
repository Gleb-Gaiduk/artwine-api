import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateOrderProductSetInput } from './dto/create-order-product-set.input';
import { OrderProduct } from './entities/order-product.entity';
import { OrderProductService } from './order-product.service';

@Resolver(() => OrderProduct)
export class OrderProductResolver {
  constructor(private readonly orderProductService: OrderProductService) {}

  @Mutation(() => OrderProduct)
  createOrderProduct(
    @Args('createOrderProductInput')
    createOrderProductInput: CreateOrderProductSetInput,
  ) {
    // return this.orderProductService.create(createOrderProductInput);
  }

  // @Query(() => [OrderProduct], { name: 'orderProduct' })
  // findAll() {
  //   return this.orderProductService.findAll();
  // }

  // @Query(() => OrderProduct, { name: 'orderProduct' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.orderProductService.findOne(id);
  // }

  // @Mutation(() => OrderProduct)
  // updateOrderProduct(
  //   @Args('updateOrderProductInput')
  //   updateOrderProductInput: UpdateOrderProductInput,
  // ) {
  //   return this.orderProductService.update(
  //     updateOrderProductInput.id,
  //     updateOrderProductInput,
  //   );
  // }

  // @Mutation(() => OrderProduct)
  // removeOrderProduct(@Args('id', { type: () => Int }) id: number) {
  //   return this.orderProductService.remove(id);
  // }
}
