import { Provider } from '@nestjs/common';
import { ReadUserPolicyProvider } from './read-user.provider';

export const userPolicyProviders: Provider[] = [ReadUserPolicyProvider];
