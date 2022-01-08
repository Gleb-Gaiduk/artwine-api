import { Provider } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Request } from 'express';
import { ReadUserPolicyHandler } from 'src/casl/handlers/user/read-user.handler';
import { getIdFromQuery } from 'src/casl/utils/regex.utils';

export const ReadUserPolicyProvider: Provider = {
  provide: ReadUserPolicyHandler,
  inject: [CONTEXT],
  useFactory: (context: Request) => {
    const query: string = context?.body?.query;
    const requestedUserId = getIdFromQuery(query);
    return new ReadUserPolicyHandler(requestedUserId);
  },
};
