import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProductService } from '../order-product/order-product.service';
import { PackageService } from '../package/package.service';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { OrderProduct } from './../order-product/entities/order-product.entity';
import { Package } from './../package/entities/package.entity';
import { UserService } from './../user/user.service';
import { PaginateService } from './../utils/paginate/paginate.service';
import { Order } from './entities/order.entity';
import { OrderStatus } from './order-status/entities/order-status.entity';
import { OrderStatusModule } from './order-status/order-status.module';
import { OrderStatusService } from './order-status/order-status.service';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  providers: [
    OrderResolver,
    OrderService,
    UserService,
    PaginateService,
    OrderProductService,
    OrderStatusService,
    PackageService,
  ],
  imports: [
    OrderStatusModule,
    TypeOrmModule.forFeature([
      Order,
      OrderProduct,
      User,
      OrderStatus,
      Package,
      Product,
    ]),
  ],
})
export class OrderModule {}
