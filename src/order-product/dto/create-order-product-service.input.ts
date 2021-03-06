import { Field, InputType, PartialType } from '@nestjs/graphql';
import { OrderProductInput } from './create-order-product.input';

@InputType()
export class CreateOrderProductServiceInput extends PartialType(
  OrderProductInput,
) {
  @Field()
  orderId: string;
}
