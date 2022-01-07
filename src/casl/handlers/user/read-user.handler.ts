import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action, IPolicyHandler } from 'src/casl/types';
import { User } from 'src/user/entities/user.entity';

export class ReadUserPolicyHandler implements IPolicyHandler {
  constructor(private userFromJWT: any) {}

  handle(ability: AppAbility) {
    if (!this.userFromJWT) return false;
    const mockedUser = new User();
    mockedUser.id = 32;

    return ability.can(Action.Read, mockedUser);
  }
}
