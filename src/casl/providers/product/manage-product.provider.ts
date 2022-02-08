import { Provider } from '@nestjs/common';
import { ManageProductPolicyHandler } from '../../handlers/product/manage-product.handler';

export const ManageProductPolicyProvider: Provider = {
  provide: ManageProductPolicyHandler,
  useFactory: () => {
    return new ManageProductPolicyHandler();
  },
};
