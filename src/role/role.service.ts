import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { User } from 'src/user/entities/user.entity';
import { UsersUtils } from 'src/user/utils/user.utils';
import { getConnection, Repository } from 'typeorm';
import { CreateRoleInput, EditRoleInput } from './dto/create-role.input';
import { Role, UserRoles } from './entities/role.entity';
import {
  RolesForUser,
  UserRolesRelation,
} from './entities/rolesForUser.entity';

@Injectable()
export class RoleService {
  private USER_ROLE = 'user_roles_role';

  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Role) private roles: Repository<Role>,
    private usersUtils: UsersUtils,
  ) {}

  async findForUser(userId: number): Promise<RolesForUser> {
    await this.usersUtils.getExistingUser(userId);

    const userRoles: UserRolesRelation[] = await getConnection()
      .createQueryBuilder()
      .select('"roleId"')
      .from(this.USER_ROLE, 'entity')
      .where('entity.userId = :userId', { userId })
      .execute();
    let userRolesIDs;

    if (userRoles) {
      userRolesIDs = userRoles.map((role) => role.roleId);
    }

    const roles = await this.roles.findByIds(userRolesIDs);
    let rolesTitles: UserRoles[] | [] = [];

    if (roles) {
      rolesTitles = roles.map((role) => role.title);
    }

    return {
      id: userId,
      roles: rolesTitles,
    };
  }

  async create(createRoleInput: CreateRoleInput): Promise<Role> {
    const existingRole = await this.roles.findOne({
      title: createRoleInput.title,
    });

    if (existingRole)
      throw new BadRequestException(
        `Role "${createRoleInput.title}" already exists`,
      );

    const role = new Role();
    role.title = createRoleInput.title;
    role.description = createRoleInput.description;

    return await this.roles.save(role);
  }

  async assignRole(assignRoleInput: EditRoleInput): Promise<boolean> {
    await this.usersUtils.getExistingUser(assignRoleInput.userId);
    const userRolesPayload = [];

    for (const role of assignRoleInput.roles) {
      const existingRole = await this.roles.findOne({
        title: role,
      });

      if (!existingRole) {
        throw new BadRequestException(`Role "${role}" doesn't exists`);
      }

      userRolesPayload.push({
        userId: assignRoleInput.userId,
        roleId: existingRole.id,
      });
    }

    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(this.USER_ROLE)
        .values(userRolesPayload)
        .returning('*')
        .execute();
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(
          'One of the passed roles has been already assigned to the user.',
        );
      }
    }

    return true;
  }

  async remove(removeRoleInput: EditRoleInput): Promise<boolean> {
    await this.usersUtils.getExistingUser(removeRoleInput.userId);
    const rolesIds = [];

    for (const role of removeRoleInput.roles) {
      const existingRole = await this.roles.findOne({
        title: role,
      });

      if (!existingRole) {
        throw new BadRequestException(`Role "${role}" doesn't exists`);
      }

      const assignedRoleToUser: UserRolesRelation[] = await getConnection()
        .createQueryBuilder()
        .select('*')
        .from(this.USER_ROLE, 'entity')
        .where('entity.userId = :userId', { userId: removeRoleInput.userId })
        .andWhere('entity.roleId = :roleId', { roleId: existingRole.id })
        .execute();

      if (isEmpty(assignedRoleToUser)) {
        throw new BadRequestException(
          `Role "${role}" wasn't assigned to a user with ID ${existingRole.id}.`,
        );
      }

      rolesIds.push(existingRole.id);
    }

    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(this.USER_ROLE)
      .where(
        `${this.USER_ROLE}."userId" = :userId AND ${this.USER_ROLE}."roleId" IN (:...rolesIds)`,
        { userId: removeRoleInput.userId, rolesIds },
      )
      .execute();

    return true;
  }
}
