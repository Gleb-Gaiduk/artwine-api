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

  async findOneByTitle(title: string): Promise<ProductPropertyValue> {
    return await this.propertyValuesRepo.findOne({
      where: { title },
      relations: ['type'],
    });
  }

  async findAllWithType(): Promise<ProductPropertyValue[]> {
    return await this.propertyValuesRepo.find({ relations: ['type'] });
  }

  async save(
    propertyValueInstance: CreateProductPropertyValueInput,
  ): Promise<ProductPropertyValue> {
    return await this.propertyValuesRepo.save(propertyValueInstance);
  }
}
