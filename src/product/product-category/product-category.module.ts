import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryResolver } from './product-category.resolver';

@Module({
  providers: [ProductCategoryResolver, ProductCategoryService]
})
export class ProductCategoryModule {}
