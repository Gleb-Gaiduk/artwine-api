import { InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { UserRoles } from '../entities/role.entity';

@InputType()
export class CreateRoleInput {
  @IsEnum(UserRoles, { message: 'Provided role name is not supported' })
  title: UserRoles;

  @IsString()
  description: string;
}

@InputType()
export class EditRoleInput {
  userId: number;

  @IsEnum(UserRoles, {
    each: true,
    message: 'Provided role name is not supported',
  })
  roles: UserRoles[];
}
