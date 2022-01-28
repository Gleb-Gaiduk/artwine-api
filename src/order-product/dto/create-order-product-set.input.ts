import { InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { OrderProductInput } from './create-order-product.input';

@InputType()
export class CreateOrderProductSetInput {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  packageId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductInput)
  products: OrderProductInput[];
}
