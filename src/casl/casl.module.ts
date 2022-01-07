import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { ReadUserPolicyHandler } from './handlers/user/read-user.handler';
import { caslProviders } from './providers';

@Global()
@Module({
  providers: [CaslAbilityFactory, ...caslProviders],
  exports: [CaslAbilityFactory, ReadUserPolicyHandler],
})
export class CaslModule {}
