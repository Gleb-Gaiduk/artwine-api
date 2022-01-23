import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';

export type PaginatedResponse<Entity> = {
  results: Entity[];
  total: number;
};

type TPaginatedResponseClass<Entity> = ClassType<PaginatedResponse<Entity>>;

export default function PaginatedResponse<Entity>(
  TItemClass: ClassType<Entity>,
): TPaginatedResponseClass<Entity> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field((type) => [TItemClass])
    results: Entity[];

    @Field((type) => Int)
    total: number;
  }
  return PaginatedResponseClass as TPaginatedResponseClass<Entity>;
}
