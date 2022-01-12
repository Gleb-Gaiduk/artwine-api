import { InputType } from '@nestjs/graphql';
import { FilterOperation } from '../enums';

@InputType()
export class FilterInput {
  operation: FilterOperation;
  values: string[];
  field: string;
  relationField?: string;
}
