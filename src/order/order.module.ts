import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderStatusModule } from './order-status/order-status.module';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  providers: [OrderResolver, OrderService],
  imports: [OrderStatusModule, TypeOrmModule.forFeature([Order])],
})
export class OrderModule {}
