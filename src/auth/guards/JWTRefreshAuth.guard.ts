import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { PassportStrategyName } from '../strategies/types';

@Injectable()
export class JWTRefreshAuthGuard extends AuthGuard(
  PassportStrategyName.JWT_REFRESH,
) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
