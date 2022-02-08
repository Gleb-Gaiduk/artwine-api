import { Order } from '../../../order/entities/order.entity';
import { AppAbility } from '../../casl-ability.factory';
import { Action, IPolicyHandler } from '../../types';

export class ManageOrderPolicyHandler implements IPolicyHandler {
  constructor(private userId: number) {}

  handle(ability: AppAbility) {
    if (!this.userId) return false;
    const mockedOrder = new Order();
    mockedOrder.userId = this.userId;

    return ability.can(Action.Manage, mockedOrder);
  }
}
