import { InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @IsString()
  category: string;
}
