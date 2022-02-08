import { Provider } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Request } from 'express';
import { ManageOrderPolicyHandler } from '../../handlers/order/manage-order.handler';

export const ManageOrderPolicyProvider: Provider = {
  provide: ManageOrderPolicyHandler,
  inject: [CONTEXT],
  useFactory: (context: Request) => {
    const query: string = context?.body?.query;
    // TODO: edit regex to retrieve id: from number and from string
    // const orderId = getIdFromQuery(query);
    // return new ManageOrderPolicyHandler(userId);
  },
};
