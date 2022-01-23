import { InputType, registerEnumType } from '@nestjs/graphql';

@InputType()
export class SortOptionsInput {
  field: string;
  order: SortOrder;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
});
