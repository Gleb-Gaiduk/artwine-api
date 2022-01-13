import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';

export default function PaginatedResponse<TItem>(
  TItemClass: ClassType<TItem>,
): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field((type) => [TItemClass])
    results: TItem[];

    @Field((type) => Int)
    total: number;
  }
  return PaginatedResponseClass;
}
