import { Module } from '@nestjs/common';
import { ProductPropertyTypeService } from './product-property-type.service';
import { ProductPropertyTypeResolver } from './product-property-type.resolver';

@Module({
  providers: [ProductPropertyTypeResolver, ProductPropertyTypeService]
})
export class ProductPropertyTypeModule {}
