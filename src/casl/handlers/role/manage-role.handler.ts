import { Role } from '../../../role/entities/role.entity';
import { AppAbility } from '../../casl-ability.factory';
import { Action, IPolicyHandler } from '../../types';

export class ManageRolePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, Role);
  }
}
