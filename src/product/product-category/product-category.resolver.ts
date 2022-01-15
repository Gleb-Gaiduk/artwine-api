import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CreateCategoryInput } from './dto/create-category.input';
import { ProductCategory } from './entities/product-category.entity';
import { ProductCategoryService } from './product-category.service';

@Resolver(() => ProductCategory)
@UseGuards(PoliciesGuard)
export class ProductCategoryResolver {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Mutation(() => ProductCategory, { name: 'createProductCategory' })
  create(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<ProductCategory> {
    return this.productCategoryService.create(createCategoryInput);
  }

  @Query(() => [ProductCategory], { name: 'productCategories' })
  findAll(): Promise<ProductCategory[]> {
    return this.productCategoryService.findAll();
  }
}
