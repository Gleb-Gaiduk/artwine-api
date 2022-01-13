import { Module } from '@nestjs/common';
import { ProductPropertyService } from './product-property.service';
import { ProductPropertyResolver } from './product-property.resolver';

@Module({
  providers: [ProductPropertyResolver, ProductPropertyService]
})
export class ProductPropertyModule {}
