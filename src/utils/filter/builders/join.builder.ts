import { forEach } from 'lodash';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { FiltersExpressionInput } from '../dto/filters-expression.input';

export class JoinBuilder<Entity> {
  private joinedEntities = new Set<string>();

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<Entity>,
    private filtersExpression?: FiltersExpressionInput,
  ) {}

  build() {
    if (this.filtersExpression)
      this.buildJoinEntitiesRec(this.filtersExpression);
  }

  private buildJoinEntitiesRec(filtersExpression: FiltersExpressionInput) {
    forEach(filtersExpression.filters, (filter) =>
      this.addJoinEntity(filter.field, filter.relationField),
    );
    forEach(filtersExpression.childExpressions, (child) =>
      this.buildJoinEntitiesRec(child),
    );
  }

  private addJoinEntity(field: string, relationField?: string) {
    const entityName = field.split('.')[0];

    if (relationField && !this.joinedEntities.has(entityName)) {
      this.queryBuilder.leftJoinAndSelect(relationField, entityName);
      this.joinedEntities.add(entityName);
    }
  }
}
