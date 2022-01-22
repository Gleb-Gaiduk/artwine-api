import { ObjectType } from '@nestjs/graphql';
import { ProductPropertyType } from '../product-property-type/entities/product-property-type.entity';
import { ProductPropertyValue } from '../product-property-value/entities/product-property-value.entity';

@ObjectType({ isAbstract: true })
export class ProductProperty {
  type: ProductPropertyType;
  value: ProductPropertyValue;
}
