import { Provider } from '@nestjs/common';
import { ManageRolePolicyHandler } from '../../handlers/role/manage-role.handler';

export const ManageRolePolicyProvider: Provider = {
  provide: ManageRolePolicyHandler,
  useFactory: () => {
    return new ManageRolePolicyHandler();
  },
};
