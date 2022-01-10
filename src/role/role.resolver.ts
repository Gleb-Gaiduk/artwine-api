import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ManageRolePolicyHandler } from './../casl/handlers/role/manage-role.handler';
import { CreateRoleInput, EditRoleInput } from './dto/create-role.input';
import { Role } from './entities/role.entity';
import { RolesForUser } from './entities/rolesForUser.entity';
import { RoleService } from './role.service';

@Resolver(() => Role)
@UseGuards(PoliciesGuard)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => RolesForUser, { name: 'userRoles' })
  @CheckPolicies(ManageRolePolicyHandler)
  async getUserRoles(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<RolesForUser> {
    return await this.roleService.findForUser(id);
  }

  @Mutation(() => Role)
  @CheckPolicies(ManageRolePolicyHandler)
  createRole(
    @Args('createRoleInput') createRoleInput: CreateRoleInput,
  ): Promise<Role> {
    return this.roleService.create(createRoleInput);
  }

  @Mutation(() => Boolean)
  @CheckPolicies(ManageRolePolicyHandler)
  removeRole(
    @Args('removeRoleInput') removeRoleInput: EditRoleInput,
  ): Promise<boolean> {
    return this.roleService.remove(removeRoleInput);
  }

  @Mutation(() => RolesForUser)
  @CheckPolicies(ManageRolePolicyHandler)
  async assignRole(
    @Args('assignRoleInput') assignRoleInput: EditRoleInput,
  ): Promise<RolesForUser> {
    await this.roleService.assignRole(assignRoleInput);
    return await this.roleService.findForUser(assignRoleInput.userId);
  }
}
