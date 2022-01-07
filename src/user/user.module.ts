import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ReadUserPolicyHandler } from 'src/casl/handlers/user/read-user.handler';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserResolver,
    UserService,
    CaslAbilityFactory,
    ReadUserPolicyHandler,
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
