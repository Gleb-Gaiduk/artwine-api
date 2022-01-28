import { InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { Status } from '../enums';

@InputType()
export class CreateOrderStatusInput {
  @IsEnum(Status)
  title: Status;

  @IsString()
  description: string;
}
