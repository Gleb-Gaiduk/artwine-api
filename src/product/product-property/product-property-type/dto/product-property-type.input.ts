import { InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateProductPropertyTypeInput {
  @IsString({ message: 'Product property type should be of a string type' })
  title: string;
}
