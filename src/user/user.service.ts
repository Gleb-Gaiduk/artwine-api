import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { getManager, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  // POST
  async create(createUserInput: CreateUserInput): Promise<User> {
    const isExistingUser = Boolean(
      (
        await this.users.find({
          where: { email: createUserInput.email },
        })
      ).length,
    );

    if (isExistingUser)
      throw new BadRequestException(
        `User with this email address "${createUserInput.email}" already exists`,
      );

    const user = new User();

    const hashedPassword = await argon2.hash(createUserInput.password);

    user.firstName = createUserInput.firstName;
    user.email = createUserInput.email;
    user.password = hashedPassword;
    if (createUserInput.lastName) user.lastName = createUserInput.lastName;
    if (createUserInput.phone) user.phone = createUserInput.phone;

    return await this.users.save(user);
  }

  // GET
  async findAll(): Promise<User[]> {
    return await this.users.find();
  }

  // GET/:id
  async findOne(id: number): Promise<User> {
    const user = await this.users.findOne(id);
    return user;
  }

  // PATCH
  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    let updatedUser;

    await getManager().transaction(async (transactionManager) => {
      await this.users.update(id, updateUserInput);

      updatedUser = await this.users.findOne(id);
    });

    return updatedUser;
  }

  // DELETE
  async remove(id: number): Promise<boolean> {
    await this.users.delete(id);
    return true;
  }
}
