import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterQueryBuilder } from 'src/utils/filter/builders/filter-query.builder';
import {
  SortOptionsInput,
  SortOrder,
} from 'src/utils/sort/dto/sort-options.input';
import { getManager, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { FiltersExpressionInput } from '../utils/filter/dto/filters-expression.input';
import { PaginationOptionsInput } from '../utils/paginate/dto/pagination-options.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { PaginatedUsers } from './entities/paginated-users.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async findAll(
    pagination: PaginationOptionsInput | null,
    filters: FiltersExpressionInput | null,
    sort: SortOptionsInput | null,
  ): Promise<PaginatedUsers> {
    const limit = pagination?.limit || 10;
    const page = pagination?.page || 1;
    const sortField = sort?.field || 'updatedAt';
    const sortOrder = sort?.order || SortOrder.DESC;

    const filterQueryBuilder = new FilterQueryBuilder<User>(
      this.users,
      filters,
    );

    const queryBuilder: SelectQueryBuilder<User> = filterQueryBuilder.build();

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

  async findOne(id: number): Promise<User> {
    const user = await this.users.findOne(id);
    return user;
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    let updatedUser;

    await getManager().transaction(async (transactionManager) => {
      await transactionManager.update(User, id, updateUserInput);

      updatedUser = await transactionManager.findOne(User, id);
    });

    return updatedUser;
  }

  async remove(id: number): Promise<boolean> {
    await this.users.delete(id);
    return true;
  }
}
