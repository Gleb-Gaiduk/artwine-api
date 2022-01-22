import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPropertyType } from './entities/product-property-type.entity';
import { ProductPropertyTypeResolver } from './product-property-type.resolver';
import { ProductPropertyTypeService } from './product-property-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPropertyType])],
  providers: [ProductPropertyTypeResolver, ProductPropertyTypeService],
})
export class ProductPropertyTypeModule {}
