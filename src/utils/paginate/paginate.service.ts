import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EntityQueryInput } from '../dto/entity-query.input';
import { FilterQueryBuilder } from '../filter/builders/filter-query.builder';
import { SortOrder } from '../sort/dto/sort-options.input';
import { PaginatedResponse } from './entities/pagination-result.entity';

@Injectable()
export class PaginateService {
  async findAllPaginatedWithFilters<Entity>(
    repository: Repository<Entity>,
    queryOptions: EntityQueryInput,
  ): Promise<PaginatedResponse<Entity>> {
    const limit = queryOptions?.pagination?.limit || 10;
    const page = queryOptions?.pagination?.page || 1;
    const sortField = queryOptions?.sort?.field || 'updatedAt';
    const sortOrder = queryOptions?.sort?.order || SortOrder.DESC;

    const filterQueryBuilder = new FilterQueryBuilder<Entity>(
      repository,
      queryOptions?.filters,
    );

    const queryBuilder: SelectQueryBuilder<Entity> = filterQueryBuilder.build();

    const [results, total] = await queryBuilder
      .orderBy(`"${sortField}"`, sortOrder)
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      results,
      total,
    };
  }
}
