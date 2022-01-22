import { Injectable } from '@nestjs/common';
import { ProductProperty } from '../entities/product-property.entity';
import { ProductPropertyValue } from '../product-property-value/entities/product-property-value.entity';

@Injectable()
export class ProductPropertiesUtils {
  async mapProductProperties(
    propertyValuesWithTypes: ProductPropertyValue[],
  ): Promise<ProductProperty[]> {
    return propertyValuesWithTypes.map((valueWithType) => {
      const { id, title, description, createdAt, updatedAt } = valueWithType;
      const value = { id, title, description, createdAt, updatedAt };

      return {
        type: valueWithType.type,
        value,
      };
    });
  }
}
