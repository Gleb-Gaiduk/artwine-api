import { Provider } from '@nestjs/common';
import { ReadUserPolicyHandler } from 'src/casl/handlers/user/read-user.handler';

export const ReadUserPolicyProvider: Provider = {
  provide: ReadUserPolicyHandler,
  // inject: [CONTEXT],
  // useFactory: (context: ExecutionContext) => {
  //   // const ctx = GqlExecutionContext.create(context);
  //   // const { user }: { user: JwtAccessTokenInput } = ctx.getContext().req;
  //   const user: JwtAccessTokenInput = { sub: 32, email: 'test@gmail.com' };
  //   return new ReadUserPolicyHandler(user);
  // },
  useValue: new ReadUserPolicyHandler({ sub: 32, email: 'test@gmail.com' }),
};
