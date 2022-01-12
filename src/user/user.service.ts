import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterQueryBuilder } from 'src/filter/builders/filter-query.builder';
import { getManager, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { FiltersExpressionInput } from './../filter/dto/filters-expression.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { UserWithPagination } from './entities/user-with-pagination.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async findAll(
    filters: FiltersExpressionInput | null,
  ): Promise<UserWithPagination> {
    const limit = 50;
    const page = 1;
    const filterQueryBuilder = new FilterQueryBuilder<User>(
      this.users,
      filters,
    );

    const queryBuilder: SelectQueryBuilder<User> = filterQueryBuilder.build();
    const [result, total] = await queryBuilder
      .orderBy('"updatedAt"', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      data: result,
      total,
    };
    // return await this.users.find();
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
