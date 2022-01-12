import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ReadUserPolicyHandler } from 'src/casl/handlers/user/read-user.handler';
import { RemoveUserPolicyHandler } from 'src/casl/handlers/user/remove-user.handler';
import { UpdateUserPolicyHandler } from './../casl/handlers/user/update-user.handler';
import { FiltersExpressionInput } from './../filter/dto/filters-expression.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { UserWithPagination } from './entities/user-with-pagination.entity';
import { User } from './entities/user.entity';
import { UserNotExistsByIDInterceptor } from './interceptors/not-exists.interceptor';
import { UserService } from './user.service';

@Resolver(() => User)
@UseGuards(PoliciesGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserWithPagination, { name: 'users' })
  async findAll(
    @Args('filters', { nullable: true }) filters: FiltersExpressionInput,
  ): Promise<UserWithPagination> {
    return await this.userService.findAll(filters);
  }

  @Query(() => User, { name: 'user' })
  @CheckPolicies(ReadUserPolicyHandler)
  @UseInterceptors(UserNotExistsByIDInterceptor)
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Mutation(() => User)
  @CheckPolicies(UpdateUserPolicyHandler)
  @UseInterceptors(UserNotExistsByIDInterceptor)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return await this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => Boolean)
  @CheckPolicies(RemoveUserPolicyHandler)
  @UseInterceptors(UserNotExistsByIDInterceptor)
  async removeUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return await this.userService.remove(id);
  }
}
