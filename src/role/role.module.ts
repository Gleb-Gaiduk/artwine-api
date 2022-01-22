import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UsersUtils } from '../user/utils/user.utils';
import { Role } from './entities/role.entity';
import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [RoleResolver, RoleService, UsersUtils],
  exports: [RoleService],
})
export class RoleModule {}
