import { User } from '../../../user/entities/user.entity';
import { AppAbility } from '../../casl-ability.factory';
import { Action, IPolicyHandler } from '../../types';

export class ReadUserPolicyHandler implements IPolicyHandler {
  constructor(private requestedUserId: number) {}

  handle(ability: AppAbility) {
    if (!this.requestedUserId) return false;
    const mockedUser = new User();
    mockedUser.id = this.requestedUserId;

    return ability.can(Action.Read, mockedUser);
  }
}
