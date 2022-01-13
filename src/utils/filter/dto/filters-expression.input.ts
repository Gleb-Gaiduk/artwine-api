import { InputType } from '@nestjs/graphql';
import { FilterOperator } from '../enums';
import { FilterInput } from './filter.input';

@InputType()
export class FiltersExpressionInput {
  operator: FilterOperator;
  filters?: FilterInput[];
  childExpressions?: FiltersExpressionInput[];
}
