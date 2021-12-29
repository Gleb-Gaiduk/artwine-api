import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRoleInput, EditRoleInput } from './dto/create-role.input';
import { Role } from './entities/role.entity';
import { RolesForUser } from './entities/rolesForUser.entity';
import { RoleService } from './role.service';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => RolesForUser, { name: 'userRoles' })
  async getUserRoles(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<RolesForUser> {
    return await this.roleService.findForUser(id);
  }

  @Mutation(() => Role)
  createRole(
    @Args('createRoleInput') createRoleInput: CreateRoleInput,
  ): Promise<Role> {
    return this.roleService.create(createRoleInput);
  }

  @Mutation(() => Boolean)
  removeRole(
    @Args('removeRoleInput') removeRoleInput: EditRoleInput,
  ): Promise<boolean> {
    return this.roleService.remove(removeRoleInput);
  }

  @Mutation(() => RolesForUser)
  async assignRole(
    @Args('assignRoleInput') assignRoleInput: EditRoleInput,
  ): Promise<RolesForUser> {
    await this.roleService.assignRole(assignRoleInput);
    return await this.roleService.findForUser(assignRoleInput.userId);
  }
}
