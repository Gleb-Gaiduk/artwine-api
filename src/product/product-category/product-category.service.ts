import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryInput } from './dto/create-category.input';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private categoriesRepo: Repository<ProductCategory>,
  ) {}

  async create({ category }: CreateCategoryInput): Promise<ProductCategory> {
    let existingCategory = await this.getCategoryByName(category);
    if (!existingCategory) existingCategory = new ProductCategory();
    existingCategory.category = category.toLowerCase().trim();

    return await this.categoriesRepo.save(existingCategory);
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.categoriesRepo.find();
  }

  async getCategoryByName(category: string): Promise<ProductCategory> {
    return await this.categoriesRepo.findOne({
      where: { category },
    });
  }

  async removeCategoryByName(category: string): Promise<boolean> {
    const existingCategory = await this.getCategoryByName(category);

    if (!existingCategory)
      throw new BadRequestException(
        `Product category "${category}" doesn't exist`,
      );

    await this.categoriesRepo.delete({ category });
    return true;
  }
}
