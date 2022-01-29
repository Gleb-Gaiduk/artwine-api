import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRoles } from './role.entity';

@ObjectType()
export class RolesForUser {
  @Field((type) => Int)
  id: number;
  roles: UserRoles[];
}

export type UserRolesRelation = {
  userId: number;
  roleId: number;
};
