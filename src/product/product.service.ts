import { BadRequestException, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionFor } from 'nest-transact';
import { Repository } from 'typeorm';
import { EntityQueryInput } from '../utils/dto/entity-query.input';
import { PaginateService } from './../utils/paginate/paginate.service';
import { CreateProductInput } from './dto/create-product.input';
import { PaginatedProducts } from './entities/paginated-products.entity';
import { Product } from './entities/product.entity';
import { ProductCategory } from './product-category/entities/product-category.entity';
import { ProductCategoryService } from './product-category/product-category.service';
import { ProductPropertyTypeService } from './product-property/product-property-type/product-property-type.service';
import { ProductPropertyValueService } from './product-property/product-property-value/product-property.service';
import { ProductPropertiesUtils } from './product-property/utils/product-properties.utils';

@Injectable()
export class ProductService extends TransactionFor<ProductService> {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly categoriesRepo: Repository<ProductCategory>,

    private readonly categoryService: ProductCategoryService,
    private readonly propertyTypeService: ProductPropertyTypeService,
    private readonly propertyValueService: ProductPropertyValueService,
    private readonly paginateService: PaginateService,

    private readonly productPropertiesUtils: ProductPropertiesUtils,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const existingProduct = await this.productsRepo.findOne({
      where: { title: createProductInput.title },
    });

    if (existingProduct)
      throw new BadRequestException(
        `Product "${createProductInput.title}" already exists`,
      );

    // Managing properties
    const { properties } = createProductInput;

    const category_propertyTypeIntersections = [];
    const product_propertyValueIntersections = [];

    for (const productProperty of properties) {
      let propertyType;
      const existingPropertyType =
        await this.propertyTypeService.findOneByTitle(
          productProperty.propertyType,
        );

      if (!existingPropertyType) {
        propertyType = await this.propertyTypeService.create({
          title: productProperty.propertyType,
        });
      } else {
        propertyType = existingPropertyType;
      }

      category_propertyTypeIntersections.push(propertyType);

      let propertyValue;
      const existingPropertyValue =
        await this.propertyValueService.findOneByTitle(
          productProperty.propertyValue,
        );

      if (!existingPropertyValue) {
        propertyValue = await this.propertyValueService.create({
          title: productProperty.propertyValue,
          description: productProperty.propertyDescription || null,
        });
      } else {
        propertyValue = existingPropertyValue;
      }

      const hasTypeValueCombination =
        propertyValue.type && propertyValue.type.title === propertyType.title;

      if (!hasTypeValueCombination) {
        propertyValue.type = propertyType;
        await this.propertyValueService.save(propertyValue);
      }

      product_propertyValueIntersections.push(propertyValue);
    }

    let existingCategory = await this.categoryService.getCategoryByName(
      createProductInput.category,
    );

    if (!existingCategory) {
      existingCategory = await this.categoryService.create({
        category: createProductInput.category,
      });
    }

    // Add ProductCategory_ProductPropertyType relation record
    existingCategory.properties = category_propertyTypeIntersections;

    const updatedCategory = await this.categoriesRepo.save(existingCategory);

    const { title, description, imagePath, itemPrice } = createProductInput;
    const newProductInstance = new Product();
    newProductInstance.title = title;
    newProductInstance.description = description;
    newProductInstance.category = updatedCategory;
    newProductInstance.imagePath = imagePath;
    newProductInstance.itemPrice = itemPrice;

    const newProduct = await this.productsRepo.save(newProductInstance);

    // Add Product_ProductPropertyValue relation record
    newProduct.propertyValues = product_propertyValueIntersections;
    await this.productsRepo.save(newProduct);

    const createdProduct = await this.productsRepo.findOne(newProduct.id, {
      relations: ['category', 'propertyValues'],
    });

    const propertyValuesWithTypes =
      await this.propertyValueService.findAllWithType();

    createdProduct.properties =
      await this.productPropertiesUtils.mapProductProperties(
        propertyValuesWithTypes,
      );

    return createdProduct;
  }

  async findAll(queryOptions: EntityQueryInput): Promise<PaginatedProducts> {
    const { results, total } =
      await this.paginateService.findAllPaginatedWithFilters<Product>(
        this.productsRepo,
        queryOptions,
      );

    // Consider passing array of paginated ids
    const propertyValuesWithTypes =
      await this.propertyValueService.findAllWithType();

    for (const product of results) {
      product.category = await this.productsRepo
        .createQueryBuilder()
        .relation(Product, 'category')
        .of(product)
        .loadOne();

      product.properties =
        await this.productPropertiesUtils.mapProductProperties(
          propertyValuesWithTypes,
        );
    }

    return {
      results,
      total,
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepo.findOne(id, {
      relations: ['category', 'propertyValues'],
    });

    if (!product) {
      throw new BadRequestException(`Product with id "${id}" does not exist`);
    }

    const propertyValuesWithTypes =
      await this.propertyValueService.findAllWithType();

    product.properties = await this.productPropertiesUtils.mapProductProperties(
      propertyValuesWithTypes,
    );

    return product;
  }

  // update(id: number, updateProductInput: UpdateProductInput) {
  //   return `This action updates a #${id} product`;
  // }

  async remove(id: number): Promise<boolean> {
    const product = await this.productsRepo.findOne(id);

    if (!product) {
      throw new BadRequestException(`Product with id "${id}" does not exist`);
    }

    await this.productsRepo.delete(id);
    return true;
  }
}
