import { InputType } from '@nestjs/graphql';
import { IsNumber, IsPositive, IsString, Max } from 'class-validator';

@InputType()
export class CreatePackageInput {
  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(999.0)
  price: number;

  @IsString()
  imagePath: string;
}
