import { Provider } from '@nestjs/common';
import { ReadUsersPolicyHandler } from 'src/casl/handlers/user/read-users.handler';

export const ReadUsersPolicyProvider: Provider = {
  provide: ReadUsersPolicyHandler,
  useFactory: () => {
    return new ReadUsersPolicyHandler();
  },
};
