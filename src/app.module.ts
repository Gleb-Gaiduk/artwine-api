import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthResolver } from './auth/auth.resolver';
import { AuthService } from './auth/auth.service';
import { JWTAccessAuthGuard } from './auth/guards/JWTAccessAuth.guard';
import { CaslModule } from './casl/casl.module';
import { __prod__ } from './constants';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { UserResolver } from './user/user.resolver';
import { UserService } from './user/user.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      // Code first approach
      // Path where  generated schema will be created
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // Sort schema lexicographically
      sortSchema: true,
      context: ({ req }) => ({ req }),
    }),

    // TypeOrm configurations
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          logging: true,
          synchronize: !__prod__,
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    // End of TypeOrm configurations

    ConfigModule.forRoot(),

    UserModule,
    AuthModule,
    RoleModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    UserResolver,
    AuthService,
    AuthResolver,
    // Allows to use dependency injection inside JWTAccessAuthGuards
    {
      provide: 'APP_GUARD',
      useClass: JWTAccessAuthGuard,
    },
  ],
})
export class AppModule {}
