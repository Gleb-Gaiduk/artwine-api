import { InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class PropertyForProductInput {
  @IsString({ message: 'Product property type should be of a string type' })
  propertyType: string;

  @IsString({ message: 'Product property value should be of a string type' })
  propertyValue: string;

  @IsOptional()
  @IsString({
    message: 'Product property description should be of a string type',
  })
  propertyDescription?: string;
}
