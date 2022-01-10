import { Provider } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Request } from 'express';
import { UpdateUserPolicyHandler } from 'src/casl/handlers/user/update-user.handler';
import { getIdFromQuery } from 'src/casl/utils/regex.utils';

export const UpdateUserPolicyProvider: Provider = {
  provide: UpdateUserPolicyHandler,
  inject: [CONTEXT],
  useFactory: (context: Request) => {
    const query: string = context?.body?.query;
    const requestedUserId = getIdFromQuery(query);
    return new UpdateUserPolicyHandler(requestedUserId);
  },
};
