import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Connection } from 'typeorm';
import { EntityQueryInput } from '../utils/dto/entity-query.input';
import { CreateProductInput } from './dto/create-product.input';
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
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return this.connection.transaction(async (transactionEntityManager) => {
      return await this.productService
        .withTransaction(transactionEntityManager)
        .create(createProductInput);
    });
  }

  @Query(() => PaginatedProducts, { name: 'products' })
  findAll(
    @Args('options', {
      nullable: true,
    })
    options?: EntityQueryInput,
  ): Promise<PaginatedProducts> {
    return this.productService.findAll(options);
  }

  // @Query(() => Product, { name: 'product' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.productService.findOne(id);
  // }

  // @Mutation(() => Product)
  // updateProduct(
  //   @Args('updateProductInput') updateProductInput: UpdateProductInput,
  // ) {
  //   return this.productService.update(
  //     updateProductInput.id,
  //     updateProductInput,
  //   );
  // }

  // @Mutation(() => Product)
  // removeProduct(@Args('id', { type: () => Int }) id: number) {
  //   return this.productService.remove(id);
  // }
}
