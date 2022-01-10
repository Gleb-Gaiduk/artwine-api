import { Provider } from '@nestjs/common';
import { ManageRolePolicyProvider } from './manage-role.provider';

export const rolePolicyProviders: Provider[] = [ManageRolePolicyProvider];
