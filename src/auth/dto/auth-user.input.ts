import { InputType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from '../../user/dto/createUser.input';

@InputType()
export class AuthUserInput extends PickType(CreateUserInput, [
  'email',
  'password',
] as const) {}
