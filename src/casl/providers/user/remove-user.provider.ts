import { Provider } from '@nestjs/common';
import { RemoveUserPolicyHandler } from 'src/casl/handlers/user/remove-user.handler';

export const RemoveUserPolicyProvider: Provider = {
  provide: RemoveUserPolicyHandler,
  useFactory: () => {
    return new RemoveUserPolicyHandler();
  },
};
