import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { ProductCategoryResolver } from './product-category.resolver';
import { ProductCategoryService } from './product-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  providers: [ProductCategoryResolver, ProductCategoryService],
})
export class ProductCategoryModule {}
