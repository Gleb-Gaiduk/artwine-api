import { InputType } from '@nestjs/graphql';

@InputType()
export class PaginationOptionsInput {
  limit: number;
  page: number;
}
