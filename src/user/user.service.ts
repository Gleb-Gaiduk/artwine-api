import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { EntityQueryInput } from '../utils/dto/entity-query.input';
import { PaginateService } from '../utils/paginate/paginate.service';
import { UpdateUserInput } from './dto/updateUser.input';
import { PaginatedUsers } from './entities/paginated-users.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepo: Repository<User>,
    private readonly _paginateService: PaginateService,
  ) {}

  async findAll(queryOptions: EntityQueryInput): Promise<PaginatedUsers> {
    return await this._paginateService.findPaginatedWithFilters<User>({
      repository: this._usersRepo,
      queryOptions,
      alias: 'user',
      relations: ['roles'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this._usersRepo.findOne(id);
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
    await this._usersRepo.delete(id);
    return true;
  }
}
