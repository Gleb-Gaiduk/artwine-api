import { Provider } from '@nestjs/common';
import { rolePolicyProviders } from './role/index';
import { userPolicyProviders } from './user';

export const caslProviders: Provider[] = [
  ...userPolicyProviders,
  ...rolePolicyProviders,
];
