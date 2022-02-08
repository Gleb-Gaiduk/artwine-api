import { Provider } from '@nestjs/common';
import { orderPolicyProviders } from './order';
import { productPolicyProviders } from './product';
import { rolePolicyProviders } from './role/index';
import { userPolicyProviders } from './user';

export const caslProviders: Provider[] = [
  ...userPolicyProviders,
  ...rolePolicyProviders,
  ...productPolicyProviders,
  ...orderPolicyProviders,
];
