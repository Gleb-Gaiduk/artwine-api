import { Provider } from '@nestjs/common';
import { ManageOrderPolicyProvider } from './manage-order.provider';
import { ReadOrdersPolicyProvider } from './read-orders.provider';

export const orderPolicyProviders: Provider[] = [
  ManageOrderPolicyProvider,
  ReadOrdersPolicyProvider,
];
