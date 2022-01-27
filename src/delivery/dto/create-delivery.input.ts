import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateDeliveryInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
