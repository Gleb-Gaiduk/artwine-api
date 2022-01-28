import { InputType } from '@nestjs/graphql';
import { IsNumber, IsPositive, Max } from 'class-validator';

@InputType()
export class OrderProductInput {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  productId: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  @Max(100)
  productAmount: number;
}
