import { InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateOrderProductSetInput } from '../../order-product/dto/create-order-product-set.input';

@InputType()
export class CreateOrderInput {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  userId: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateOrderProductSetInput)
  productSets: CreateOrderProductSetInput[];
}
