import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { FiltersExpressionInput } from '../dto/filters-expression.input';
import { JoinBuilder } from './join.builder';
import { WhereBuilder } from './where.builder';

SelectQueryBuilder.prototype.leftJoinAndSelectWithRelations = function <Entity>(
  alias: string,
  relations: string[],
): SelectQueryBuilder<Entity> {
  for (const relation of relations) {
    this.leftJoinAndSelect(`${alias}.${relation}`, `${relation}`);
  }
  return this;
};
export class FilterQueryBuilder<Entity> {
  private readonly _queryBuilder: SelectQueryBuilder<Entity>;

  constructor(
    entityRepository: Repository<Entity>,
    private filtersExpression?: FiltersExpressionInput,
    private alias: string = '',
  ) {
    this._queryBuilder = entityRepository.createQueryBuilder(alias);
  }

  build() {
    const joinBuilder = new JoinBuilder<Entity>(
      this._queryBuilder,
      this.filtersExpression,
    );
    joinBuilder.build();

    const whereBuilder = new WhereBuilder<Entity>(
      this._queryBuilder,
      this.filtersExpression,
    );
    whereBuilder.build();

    return this._queryBuilder;
  }
}
