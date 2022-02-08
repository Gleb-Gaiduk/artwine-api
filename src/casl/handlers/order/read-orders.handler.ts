import { Order } from '../../../order/entities/order.entity';
import { AppAbility } from '../../casl-ability.factory';
import { Action, IPolicyHandler } from '../../types';

export class ReadOrdersPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Order);
  }
}
