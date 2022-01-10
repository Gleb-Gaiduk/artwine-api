import { Provider } from '@nestjs/common';
import { ReadUserPolicyProvider } from './read-user.provider';
import { RemoveUserPolicyProvider } from './remove-user.provider';
import { UpdateUserPolicyProvider } from './update-user.provider';

export const userPolicyProviders: Provider[] = [
  ReadUserPolicyProvider,
  UpdateUserPolicyProvider,
  RemoveUserPolicyProvider,
];
