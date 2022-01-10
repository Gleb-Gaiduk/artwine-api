import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action, IPolicyHandler } from 'src/casl/types';
import { User } from 'src/user/entities/user.entity';

export class UpdateUserPolicyHandler implements IPolicyHandler {
  constructor(private requestedUserId: number) {}

  handle(ability: AppAbility) {
    if (!this.requestedUserId) return false;
    const mockedUser = new User();
    mockedUser.id = this.requestedUserId;

    return ability.can(Action.Update, mockedUser);
  }
}
