import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateOrderProductSetInput } from './create-order-product-set.input';

@InputType()
export class UpdateOrderProductInput extends PartialType(
  CreateOrderProductSetInput,
) {
  @Field(() => Int)
  id: number;
}
