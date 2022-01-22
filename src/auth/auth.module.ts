import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    RoleModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
