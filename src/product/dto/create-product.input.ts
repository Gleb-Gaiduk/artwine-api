import { InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsNumberString, IsString } from 'class-validator';
import { PropertyForProductInput } from '../product-property/product-property-type/dto/product-categories.input';

@InputType()
export class CreateProductInput {
  @IsString({ message: 'Product category should be of a string type' })
  category: string;

  @IsString({ message: 'Product title should be of a string type' })
  title: string;

  @IsString({ message: 'Product description should be of a string type' })
  description: string;

  @IsString({ message: 'Image path should be of a string type' })
  imagePath: string;

  @IsNumberString({ message: 'Product price should be a positive number' })
  itemPrice: string;

  @ArrayNotEmpty({ message: 'Product can not be created without properties' })
  @Type(() => PropertyForProductInput)
  properties: PropertyForProductInput[];
}
