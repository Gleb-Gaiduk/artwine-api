import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Connection } from 'typeorm';
import { Public } from '../auth/decorators/public.decorator';
import { CheckPolicies } from '../casl/decorators/check-policies.decorator';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { ManageProductPolicyHandler } from '../casl/handlers/product/manage-product.handler';
import { EntityQueryInput } from '../utils/dto/entity-query.input';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PaginatedProducts } from './entities/paginated-products.entity';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private connection: Connection,
  ) {}

  @Mutation(() => Product)
  @UseGuards(PoliciesGuard)
  @CheckPolicies(ManageProductPolicyHandler)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return this.connection.transaction(async (transactionEntityManager) => {
      return await this.productService
        .withTransaction(transactionEntityManager)
        .create(createProductInput);
    });
  }

  @Public()
  @Query(() => PaginatedProducts, { name: 'products' })
  findAll(
    @Args('options', {
      nullable: true,
    })
    options?: EntityQueryInput,
  ): Promise<PaginatedProducts> {
    return this.productService.findAll(options);
  }

  @Public()
  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product)
  @UseGuards(PoliciesGuard)
  @CheckPolicies(ManageProductPolicyHandler)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productService.update(
      updateProductInput.id,
      updateProductInput,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(PoliciesGuard)
  @CheckPolicies(ManageProductPolicyHandler)
  removeProduct(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.productService.remove(id);
  }
}
