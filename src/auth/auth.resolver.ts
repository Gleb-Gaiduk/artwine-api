import { UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/user/dto/createUser.input';
import { UserWithTokens } from 'src/user/entities/userWithTokens.entity';
import { TransformInterceptor } from 'src/user/interceptors/mapp-res.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { AuthUserInput } from './dto/auth-user.input';
import { JwtTokenPayload } from './entities/tokens.entity';
import { GqlAuthGuard } from './guards/gqlAuthGuard.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // CREATE USER
  @Mutation(() => UserWithTokens)
  @UseInterceptors(TransformInterceptor)
  async createUser(
    @Args('createUserInput', new ValidationPipe())
    createUserInput: CreateUserInput,
  ): Promise<UserWithTokens> {
    return await this.authService.register(createUserInput);
  }

  // LOGIN
  @Mutation(() => UserWithTokens)
  @UseInterceptors(TransformInterceptor)
  async login(
    @Args('authUserInput', new ValidationPipe())
    authUserInput: AuthUserInput,
  ): Promise<UserWithTokens> {
    return await this.authService.login(authUserInput);
  }

  // LOGOUT
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@CurrentUser() user: JwtTokenPayload): Promise<boolean> {
    return await this.authService.logout(user.sub);
  }

  // async refreshToken() {
  //   this.authService.refreshToken();
  // }
}
