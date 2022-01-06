import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action, IPolicyHandler } from 'src/casl/types';
import { User } from 'src/user/entities/user.entity';

export class ReadUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    const mockedUser = new User();
    mockedUser.id = 32;

    return ability.can(Action.Read, mockedUser);
  }
}
