import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action, IPolicyHandler } from 'src/casl/types';
import { Role } from 'src/role/entities/role.entity';

export class ManageRolePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, Role);
  }
}
