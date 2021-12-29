import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.users.find();
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
