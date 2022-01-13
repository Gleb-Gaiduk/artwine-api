import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { ProductPropertyModule } from './product-property/product-property.module';
import { ProductPropertyTypeModule } from './product-property-type/product-property-type.module';

@Module({
  providers: [ProductResolver, ProductService],
  imports: [ProductPropertyModule, ProductPropertyTypeModule]
})
export class ProductModule {}
