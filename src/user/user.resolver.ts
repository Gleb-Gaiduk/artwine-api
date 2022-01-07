import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ReadUserPolicyHandler } from 'src/casl/handlers/user/read-user.handler';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UserNotExistsByIDInterceptor } from './interceptors/not-exists.interceptor';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies(ReadUserPolicyHandler)
  @UseInterceptors(UserNotExistsByIDInterceptor)
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Mutation(() => User)
  @UseInterceptors(UserNotExistsByIDInterceptor)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return await this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => Boolean)
  @UseInterceptors(UserNotExistsByIDInterceptor)
  async removeUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return await this.userService.remove(id);
  }
}
