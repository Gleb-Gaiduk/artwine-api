import { InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProductPropertyValueInput {
  @IsString({ message: 'Product property value should be of a string type' })
  title: string;

  @IsOptional()
  @IsString({
    message: 'message: Product property description should be of a string type',
  })
  description?: string;
}
