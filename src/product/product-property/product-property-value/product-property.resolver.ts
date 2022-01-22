import { Resolver } from '@nestjs/graphql';
import { ProductPropertyValueService } from './product-property.service';

@Resolver()
export class ProductPropertyResolver {
  constructor(
    private readonly productPropertyService: ProductPropertyValueService,
  ) {}
}
