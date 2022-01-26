import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreatePackageInput } from './create-package.input';

@InputType()
export class UpdatePackageInput extends PartialType(CreatePackageInput) {
  @Field(() => ID)
  id: number;
}
