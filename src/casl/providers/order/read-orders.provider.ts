import { Provider } from '@nestjs/common';
import { ReadOrdersPolicyHandler } from '../../handlers/order/read-orders.handler';

export const ReadOrdersPolicyProvider: Provider = {
  provide: ReadOrdersPolicyHandler,
  useFactory: () => {
    return new ReadOrdersPolicyHandler();
  },
};
