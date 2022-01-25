import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ProductProperty } from '../entities/product-property.entity';
import { PropertyForProductInput } from '../product-property-type/dto/product-categories.input';
import { ProductPropertyType } from '../product-property-type/entities/product-property-type.entity';
import { ProductPropertyTypeService } from '../product-property-type/product-property-type.service';
import { ProductPropertyValue } from '../product-property-value/entities/product-property-value.entity';
import { ProductPropertyValueService } from '../product-property-value/product-property.service';

@Injectable()
export class ProductPropertiesUtils {
  constructor(
    private readonly propertyTypeService: ProductPropertyTypeService,
    private readonly propertyValueService: ProductPropertyValueService,
  ) {}

  async saveProperties(
    properties: PropertyForProductInput[],
  ): Promise<[ProductPropertyType[], ProductPropertyValue[]]> {
    if (isEmpty(properties)) return [[], []];

    const category_propertyTypeIntersections: ProductPropertyType[] = [];
    const product_propertyValueIntersections: ProductPropertyValue[] = [];

    for (const productProperty of properties) {
      const propertyType = await this.propertyTypeService.getSaved(
        productProperty.propertyType,
      );

      category_propertyTypeIntersections.push(propertyType);
      const propertyValue = await this.propertyValueService.getSaved(
        productProperty.propertyValue,
        productProperty.propertyDescription,
      );

      if (!this.hasTypeValueCombination(propertyType, propertyValue)) {
        propertyValue.type = propertyType;
        await this.propertyValueService.save(propertyValue);
      }

      product_propertyValueIntersections.push(propertyValue);
    }

    return [
      category_propertyTypeIntersections,
      product_propertyValueIntersections,
    ];
  }

  async mapProperties(
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

  hasTypeValueCombination(
    propertyType: ProductPropertyType,
    propertyValue: ProductPropertyValue,
  ): boolean {
    return (
      propertyValue.type && propertyValue.type.title === propertyType.title
    );
  }
}
