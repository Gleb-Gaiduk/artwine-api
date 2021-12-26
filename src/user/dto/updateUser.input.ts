import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './createUser.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;
}
