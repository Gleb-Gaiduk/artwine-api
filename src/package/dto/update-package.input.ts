import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreatePackageInput } from './create-package.input';

@InputType()
export class UpdatePackageInput extends PartialType(CreatePackageInput) {
  @Field(() => Int)
  id: number;
}
