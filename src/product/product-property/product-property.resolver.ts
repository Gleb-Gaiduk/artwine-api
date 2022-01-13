import { Resolver } from '@nestjs/graphql';
import { ProductPropertyService } from './product-property.service';

@Resolver()
export class ProductPropertyResolver {
  constructor(private readonly productPropertyService: ProductPropertyService) {}
}
