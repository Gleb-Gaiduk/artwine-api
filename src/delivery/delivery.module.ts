import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryResolver } from './delivery.resolver';

@Module({
  providers: [DeliveryResolver, DeliveryService]
})
export class DeliveryModule {}
