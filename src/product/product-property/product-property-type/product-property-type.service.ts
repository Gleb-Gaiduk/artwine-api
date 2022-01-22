import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductPropertyTypeInput } from './dto/product-property-type.input';
import { ProductPropertyType } from './entities/product-property-type.entity';

@Injectable()
export class ProductPropertyTypeService {
  constructor(
    @InjectRepository(ProductPropertyType)
    private readonly propertyTypesRepo: Repository<ProductPropertyType>,
  ) {}

  async create(
    propertyTypeInput: CreateProductPropertyTypeInput,
  ): Promise<ProductPropertyType> {
    const propertyTypeInstance = new ProductPropertyType();
    propertyTypeInstance.title = propertyTypeInput.title;

    return await this.propertyTypesRepo.save(propertyTypeInstance);
  }

  async findOneByTitle(title: string): Promise<ProductPropertyType> {
    return await this.propertyTypesRepo.findOne({ where: { title } });
  }

  async findManyByIDs(ids: number[]): Promise<ProductPropertyType[]> {
    return await this.propertyTypesRepo.findByIds(ids, {
      relations: ['type'],
    });
  }
}
