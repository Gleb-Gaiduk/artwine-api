import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { OrderStatusModule } from './order-status/order-status.module';

@Module({
  providers: [OrderResolver, OrderService],
  imports: [OrderStatusModule]
})
export class OrderModule {}
