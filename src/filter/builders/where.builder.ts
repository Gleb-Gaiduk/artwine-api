import { isEmpty, map } from 'lodash';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { FilterOperation } from '../enums';
import { FilterInput } from './../dto/filter.input';
import { FiltersExpressionInput } from './../dto/filters-expression.input';

type ParamValue = string | number | Array<string | number>;

export class WhereBuilder<Entity> {
  private params: Record<string, ParamValue> = {};
  private paramsCount = 0;

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<Entity>,
    private filtersExpression?: FiltersExpressionInput,
  ) {}

  build() {
    if (!this.filtersExpression) return;

    const whereSql = this.buildExpressionRec(this.filtersExpression);
    this.queryBuilder.where(whereSql, this.params);
  }

  private buildExpressionRec(
    filtersExpression: FiltersExpressionInput,
  ): string {
    const filters = map(filtersExpression.filters, (filter) =>
      this.buildFilter(filter),
    );
    const children = map(filtersExpression.childExpressions, (child) =>
      this.buildExpressionRec(child),
    );

    const allSqlBlocks = [...filters, ...children];
    const sqLExpr = allSqlBlocks.join(` ${filtersExpression.operator} `);
    return isEmpty(sqLExpr) ? '' : `(${sqLExpr})`;
  }

  private buildFilter(filter: FilterInput): string {
    const paramName = `${filter.field}_${++this.paramsCount}`;
    switch (filter.operation) {
      case FilterOperation.EQ:
        this.params[paramName] = filter.values[0];
        return `${filter.field} = :${paramName}`;
      case FilterOperation.IN:
        this.params[paramName] = filter.values;
        return `${filter.field} IN (:${paramName})`;
      case FilterOperation.LIKE:
        this.params[paramName] = `%${filter.values[0]}%`;
        return `${filter.field} LIKE :${paramName}`;
      case FilterOperation.GE:
        this.params[paramName] = filter.values[0];
        return `${filter.field} >= :${paramName}`;
      default:
        throw new Error(`Unknown filter operation: ${filter.operation}`);
    }
  }
}
