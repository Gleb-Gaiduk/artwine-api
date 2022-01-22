import { Resolver } from '@nestjs/graphql';
import { ProductPropertyTypeService } from './product-property-type.service';

@Resolver()
export class ProductPropertyTypeResolver {
  constructor(private readonly productPropertyTypeService: ProductPropertyTypeService) {}
}
