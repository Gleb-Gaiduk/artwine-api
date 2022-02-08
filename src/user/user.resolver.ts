import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReadUsersPolicyHandler } from 'src/casl/handlers/user/read-users.handler';
import { CheckPolicies } from '../casl/decorators/check-policies.decorator';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { ReadUserPolicyHandler } from '../casl/handlers/user/read-user.handler';
import { RemoveUserPolicyHandler } from '../casl/handlers/user/remove-user.handler';
import { EntityQueryInput } from '../utils/dto/entity-query.input';
import { UpdateUserPolicyHandler } from './../casl/handlers/user/update-user.handler';
import { UpdateUserInput } from './dto/updateUser.input';
import { PaginatedUsers } from './entities/paginated-users.entity';
import { User } from './entities/user.entity';
import { UserNotExistsByIDInterceptor } from './interceptors/not-exists.interceptor';
import { UserService } from './user.service';

@Resolver(() => User)
@UseGuards(PoliciesGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => PaginatedUsers, { name: 'users' })
  @CheckPolicies(ReadUsersPolicyHandler)
  async findAll(
    @Args('options') options: EntityQueryInput,
  ): Promise<PaginatedUsers> {
    return await this.userService.findAll(options);
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
