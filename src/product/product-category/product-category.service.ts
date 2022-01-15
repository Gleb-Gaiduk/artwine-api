import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryInput } from './dto/create-category.input';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private categories: Repository<ProductCategory>,
  ) {}

  async create({ category }: CreateCategoryInput): Promise<ProductCategory> {
    const existingCategory = await this.getCategoryByName(category);

    if (existingCategory)
      throw new BadRequestException(
        `Product category "${category}" already exists`,
      );

    const newCategory = new ProductCategory();
    newCategory.category = category.toLowerCase().trim();

    return await this.categories.save(newCategory);
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.categories.find();
  }

  async getCategoryByName(category: string): Promise<ProductCategory> {
    return await this.categories.findOne({
      where: { category },
    });
  }

  async removeCategoryByName(category: string): Promise<boolean> {
    const existingCategory = await this.getCategoryByName(category);

    if (!existingCategory)
      throw new BadRequestException(
        `Product category "${category}" doesn't exist`,
      );

    await this.categories.delete({ category });
    return true;
  }
}
