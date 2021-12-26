import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { CreateUserInput } from 'src/user/dto/createUser.input';
import { User } from 'src/user/entities/user.entity';
import { UserWithTokens } from 'src/user/entities/userWithTokens.entity';
import { Repository } from 'typeorm';
import { AuthUserInput } from './dto/auth-user.input';
import { JwtTokenPayload, Tokens } from './entities/tokens.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  // REGISTER
  async register(createUserInput: CreateUserInput): Promise<UserWithTokens> {
    const existingUser = await this.getExistingUserByEmail(
      createUserInput.email,
      { withRestrictedFields: false },
    );

    if (existingUser)
      throw new BadRequestException(
        `User with this email address "${createUserInput.email}" already exists`,
      );

    const user = new User();
    const hashedPassword = await argon2.hash(createUserInput.password);
    user.firstName = createUserInput.firstName;
    user.email = createUserInput.email;
    user.password = hashedPassword;
    if (createUserInput.lastName) user.lastName = createUserInput.lastName;
    if (createUserInput.phone) user.phone = createUserInput.phone;

    const createdUser = await this.users.save(user);
    const jwtTokens = await this.generateJWTTokens(
      createdUser.id,
      createdUser.email,
    );
    await this.updateRefreshTokenForUser(
      createdUser.id,
      jwtTokens.refresh_token,
    );

    return {
      ...createdUser,
      auth: jwtTokens,
    };
  }

  // LOGIN
  async login(authUserInput: AuthUserInput): Promise<UserWithTokens> {
    const existingUser = await this.getExistingUserByEmail(
      authUserInput.email,
      { withRestrictedFields: true },
    );

    if (!existingUser) {
      throw new ForbiddenException('User email or password is incorrect');
    }

    const arePasswordMatched = await argon2.verify(
      existingUser.password,
      authUserInput.password,
    );

    if (!arePasswordMatched) {
      throw new ForbiddenException('User email or password is incorrect');
    }

    const jwtTokens = await this.generateJWTTokens(
      existingUser.id,
      existingUser.email,
    );
    await this.updateRefreshTokenForUser(
      existingUser.id,
      jwtTokens.refresh_token,
    );

    return {
      ...existingUser,
      auth: jwtTokens,
    };
  }

  async logout(userId: number): Promise<boolean> {
    await this.users.update(userId, { refreshToken: null });
    return true;
  }
  // async refreshToken() {}

  async generateJWTTokens(userId: number, email: string): Promise<Tokens> {
    const jwtTokenPayload: JwtTokenPayload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtTokenPayload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: 60 * 15, // 15 min
      }),

      this.jwtService.signAsync(jwtTokenPayload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: 60 * 60 * 24 * 7, // 1 week,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshTokenForUser(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.users.update(userId, { refreshToken: hashedRefreshToken });
    return true;
  }

  async getExistingUserByEmail(
    email: string,
    config: { withRestrictedFields: boolean },
  ): Promise<User> {
    let existingUser;

    if (config.withRestrictedFields) {
      existingUser = await this.users.findOne({
        select: this.getAllEntityProperties(this.users),
        where: { email },
      });
    } else {
      existingUser = await this.users.findOne({
        where: { email },
      });
    }

    return existingUser;
  }

  // Allows to retrieve all columns for Entity from DataBase
  // including fields with  @Column({ select: false }) decorator
  getAllEntityProperties<T>(repository: Repository<T>): (keyof T)[] {
    return repository.metadata.columns.map(
      (col) => col.propertyName,
    ) as (keyof T)[];
  }
}
