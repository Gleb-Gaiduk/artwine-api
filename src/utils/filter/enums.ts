import { registerEnumType } from '@nestjs/graphql';

export enum FilterOperator {
  AND = 'and',
  OR = 'or',
}

export enum FilterOperation {
  EQ = 'eq',
  NE = 'ne',
  IN = 'in',
  LIKE = 'like',
  LT = 'lt',
  LE = 'le',
  GE = 'ge',
  GT = 'gt',
}

registerEnumType(FilterOperator, {
  name: 'FilterOperator',
});

registerEnumType(FilterOperation, {
  name: 'FilterOperation',
});
