import { User } from '../../../user/entities/user.entity';
import { AppAbility } from '../../casl-ability.factory';
import { Action, IPolicyHandler } from '../../types';

export class RemoveUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    const mockedUser = new User();

    return ability.can(Action.Read, mockedUser);
  }
}
