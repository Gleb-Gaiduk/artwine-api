import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginateService } from '../utils/paginate/paginate.service';
import { Product } from './entities/product.entity';
import { ProductCategory } from './product-category/entities/product-category.entity';
import { ProductCategoryService } from './product-category/product-category.service';
import { ProductPropertyType } from './product-property/product-property-type/entities/product-property-type.entity';
import { ProductPropertyTypeModule } from './product-property/product-property-type/product-property-type.module';
import { ProductPropertyTypeService } from './product-property/product-property-type/product-property-type.service';
import { ProductPropertyValue } from './product-property/product-property-value/entities/product-property-value.entity';
import { ProductPropertyModule } from './product-property/product-property-value/product-property.module';
import { ProductPropertyValueService } from './product-property/product-property-value/product-property.service';
import { ProductPropertiesUtils } from './product-property/utils/product-properties.utils';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  providers: [
    ProductResolver,
    ProductService,
    ProductCategoryService,
    ProductPropertyTypeService,
    ProductPropertyValueService,
    ProductPropertiesUtils,
    PaginateService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductCategory,
      ProductPropertyType,
      ProductPropertyValue,
    ]),
    ProductPropertyModule,
    ProductPropertyTypeModule,
    ProductModule,
    ProductPropertyTypeModule,
    ProductPropertyModule,
  ],
})
export class ProductModule {}
