import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from '../package/entities/package.entity';
import { PackageService } from '../package/package.service';
import { Product } from '../product/entities/product.entity';
import { OrderProduct } from './entities/order-product.entity';
import { OrderProductResolver } from './order-product.resolver';
import { OrderProductService } from './order-product.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct, Package, Product])],
  providers: [OrderProductResolver, OrderProductService, PackageService],
})
export class OrderProductModule {}
