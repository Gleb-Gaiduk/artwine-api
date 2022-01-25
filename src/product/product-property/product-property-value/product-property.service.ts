import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductPropertyValueInput } from './dto/product-property-value.input';
import { ProductPropertyValue } from './entities/product-property-value.entity';

@Injectable()
export class ProductPropertyValueService {
  constructor(
    @InjectRepository(ProductPropertyValue)
    private readonly propertyValuesRepo: Repository<ProductPropertyValue>,
  ) {}

  async create(
    propertyValueInput: CreateProductPropertyValueInput,
  ): Promise<ProductPropertyValue> {
    const propertyTypeInstance = new ProductPropertyValue();
    propertyTypeInstance.title = propertyValueInput.title;

    if (propertyValueInput.description) {
      propertyTypeInstance.description = propertyValueInput.description;
    }

    return await this.propertyValuesRepo.create(propertyTypeInstance);
  }

  async getSaved(
    propertyValue: string,
    propertyDescription: string,
  ): Promise<ProductPropertyValue> {
    let propertyValueResult;
    const existingPropertyValue = await this.findOneByTitle(propertyValue);

    if (!existingPropertyValue) {
      propertyValueResult = await this.create({
        title: propertyValue,
        description: propertyDescription || null,
      });
    } else {
      propertyValueResult = existingPropertyValue;
    }

    return propertyValueResult;
  }

  async findOneByTitle(title: string): Promise<ProductPropertyValue> {
    return await this.propertyValuesRepo.findOne({
      where: { title },
      relations: ['type'],
    });
  }

  async findWithTypeByIDs(ids: number[]): Promise<ProductPropertyValue[]> {
    return await this.propertyValuesRepo.findByIds(ids, {
      relations: ['type'],
    });
  }

  async save(
    propertyValueInstance: CreateProductPropertyValueInput,
  ): Promise<ProductPropertyValue> {
    return await this.propertyValuesRepo.save(propertyValueInstance);
  }
}
