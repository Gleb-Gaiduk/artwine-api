import { Provider } from '@nestjs/common';
import { ManageProductPolicyProvider } from './manage-product.provider';

export const productPolicyProviders: Provider[] = [ManageProductPolicyProvider];
