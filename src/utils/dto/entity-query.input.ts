import { InputType } from '@nestjs/graphql';
import { FiltersExpressionInput } from '../filter/dto/filters-expression.input';
import { SearchQueryInput } from '../search/dto/search.input';
import { PaginationOptionsInput } from './../paginate/dto/pagination-options.input';
import { SortOptionsInput } from './../sort/dto/sort-options.input';

@InputType()
export class EntityQueryInput {
  filters?: FiltersExpressionInput;
  pagination?: PaginationOptionsInput;
  sort?: SortOptionsInput;
  search?: SearchQueryInput;
}
