import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { FiltersExpressionInput } from '../dto/filters-expression.input';
import { JoinBuilder } from './join.builder';
import { WhereBuilder } from './where.builder';

export class FilterQueryBuilder<Entity> {
  private readonly queryBuilder: SelectQueryBuilder<Entity>;

  constructor(
    entityRepository: Repository<Entity>,
    private filtersExpression?: FiltersExpressionInput,
  ) {
    this.queryBuilder = entityRepository.createQueryBuilder();
  }

  build() {
    const joinBuilder = new JoinBuilder<Entity>(
      this.queryBuilder,
      this.filtersExpression,
    );
    joinBuilder.build();

    const whereBuilder = new WhereBuilder<Entity>(
      this.queryBuilder,
      this.filtersExpression,
    );
    whereBuilder.build();

    return this.queryBuilder;
  }
}
