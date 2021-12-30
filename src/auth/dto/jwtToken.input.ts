import { InputType } from '@nestjs/graphql';
import { UserRoles } from 'src/role/entities/role.entity';

@InputType()
export class JwtAccessTokenInput {
  sub: number;
  email: string;
  roles?: UserRoles[];
  iat?: number;
  exp?: number;
}

@InputType()
export class JwtRefreshTokenInput extends JwtAccessTokenInput {
  refreshToken: string;
}
