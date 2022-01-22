import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  Type,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef, Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtAccessTokenInput } from '../../auth/dto/jwtToken.input';
import { AppAbility, CaslAbilityFactory } from '../casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { PolicyHandler } from '../types';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policiesHandlersRef =
      this.reflector.get<Type<PolicyHandler[]>>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const ctx = GqlExecutionContext.create(context);
    const { user }: { user: JwtAccessTokenInput } = ctx.getContext().req;

    const contextId = ContextIdFactory.create();
    this.moduleRef.registerRequestByContextId(ctx.getContext().req, contextId);

    const policyHandlers: PolicyHandler[] = [];
    for (let i = 0; i < policiesHandlersRef.length; i++) {
      const policyHandlerRef = policiesHandlersRef[i];
      const policyScope = this.moduleRef.introspect(policyHandlerRef).scope;
      let policyHandler: PolicyHandler;
      if (policyScope === Scope.DEFAULT) {
        policyHandler = this.moduleRef.get(policyHandlerRef, { strict: false });
      } else {
        policyHandler = await this.moduleRef.resolve(
          policyHandlerRef,
          contextId,
          { strict: false },
        );
      }
      policyHandlers.push(policyHandler);
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
