import { CreateDeliveryInput } from './create-delivery.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDeliveryInput extends PartialType(CreateDeliveryInput) {
  @Field(() => Int)
  id: number;
}
