import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPropertyValue } from './entities/product-property-value.entity';
import { ProductPropertyResolver } from './product-property.resolver';
import { ProductPropertyValueService } from './product-property.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPropertyValue])],
  providers: [ProductPropertyResolver, ProductPropertyValueService],
})
export class ProductPropertyModule {}
