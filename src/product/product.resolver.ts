import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Connection } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
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

  // @Query(() => [Product], { name: 'product' })
  // findAll() {
  //   return this.productService.findAll();
  // }

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
