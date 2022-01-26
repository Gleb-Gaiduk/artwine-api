import { InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateOrderStatusInput {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
