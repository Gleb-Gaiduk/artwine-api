import { BadRequestException, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { TransactionFor } from 'nest-transact';
import { Repository } from 'typeorm';
import { EntityQueryInput } from '../utils/dto/entity-query.input';
import { PaginateService } from './../utils/paginate/paginate.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PaginatedProducts } from './entities/paginated-products.entity';
import { Product } from './entities/product.entity';
import { ProductCategory } from './product-category/entities/product-category.entity';
import { ProductCategoryService } from './product-category/product-category.service';
import { ProductPropertyTypeService } from './product-property/product-property-type/product-property-type.service';
import { ProductPropertyValue } from './product-property/product-property-value/entities/product-property-value.entity';
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

    if (existingProduct) {
      throw new BadRequestException(
        `Product "${createProductInput.title}" already exists`,
      );
    }

    const [
      category_propertyTypeIntersections,
      product_propertyValueIntersections,
    ] = await this.productPropertiesUtils.saveProperties(
      createProductInput.properties,
    );

    let productCategory = await this.categoryService.getSaved(
      createProductInput.category,
    );

    // Add ProductCategory_ProductPropertyType relation record
    productCategory.properties = category_propertyTypeIntersections;
    productCategory = await this.categoriesRepo.save(productCategory);

    const { title, description, imagePath, price } = createProductInput;
    const newProductInstance = new Product();
    newProductInstance.title = title;
    newProductInstance.description = description;
    newProductInstance.category = productCategory;
    newProductInstance.imagePath = imagePath;
    newProductInstance.price = price;
    // Add Product_ProductPropertyValue relation record
    newProductInstance.propertyValues = product_propertyValueIntersections;

    const newProduct = await this.productsRepo.save(newProductInstance);

    const createdProduct = await this.productsRepo.findOne(newProduct.id, {
      relations: ['category', 'propertyValues'],
    });

    const propertiesValueIDs = product_propertyValueIntersections.map(
      (value) => value.id,
    );

    const propertyValuesWithTypes =
      await this.propertyValueService.findWithTypeByIDs(propertiesValueIDs);

    createdProduct.properties = await this.productPropertiesUtils.mapProperties(
      propertyValuesWithTypes,
    );

    return createdProduct;
  }

  async update(
    id: number,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const existingProduct = await this.productsRepo.findOne(id);

    if (!existingProduct) {
      throw new BadRequestException(`Product with id "${id}" does not exist`);
    }

    let productCategory;
    if (updateProductInput.category) {
      productCategory = await this.categoryService.getSaved(
        updateProductInput.category,
      );
    } else {
      productCategory = (
        await this.productsRepo.findOne(id, {
          relations: ['category'],
        })
      ).category;
    }

    let propertyValues;
    if (!isEmpty(updateProductInput.properties)) {
      const [
        category_propertyTypeIntersections,
        product_propertyValueIntersections,
      ] = await this.productPropertiesUtils.saveProperties(
        updateProductInput.properties,
      );
      propertyValues = product_propertyValueIntersections;

      productCategory.properties = category_propertyTypeIntersections;
      productCategory = await this.categoriesRepo.save(productCategory);
    }

    const { title, description, imagePath, price } = updateProductInput;
    const updatedProductInstance = new Product();
    updatedProductInstance.id = id;
    if (title) updatedProductInstance.title = title;
    if (description) updatedProductInstance.description = description;
    updatedProductInstance.category = productCategory;
    if (imagePath) updatedProductInstance.imagePath = imagePath;
    if (price) updatedProductInstance.price = price;
    if (!isEmpty(propertyValues)) {
      updatedProductInstance.propertyValues = propertyValues;
    }

    await this.productsRepo.save(updatedProductInstance);
    const updatedProduct = await this.productsRepo.findOne(id, {
      relations: ['category', 'propertyValues'],
    });

    let propertiesValueIDs;
    if (!isEmpty(propertyValues)) {
      propertiesValueIDs = propertyValues.map((value) => value.id);
    } else {
      propertiesValueIDs = updatedProduct.propertyValues.map(
        (value) => value.id,
      );
    }

    const propertyValuesWithTypes =
      await this.propertyValueService.findWithTypeByIDs(propertiesValueIDs);

    updatedProduct.properties = await this.productPropertiesUtils.mapProperties(
      propertyValuesWithTypes,
    );

    return updatedProduct;
  }

  async findAll(queryOptions: EntityQueryInput): Promise<PaginatedProducts> {
    const { results, total } =
      await this.paginateService.findAllPaginatedWithFilters<Product>(
        this.productsRepo,
        queryOptions,
      );

    for (const product of results) {
      product.category = await this.productsRepo
        .createQueryBuilder()
        .relation(Product, 'category')
        .of(product)
        .loadOne();

      const productPropertiesValues: ProductPropertyValue[] =
        await this.productsRepo
          .createQueryBuilder()
          .relation(Product, 'propertyValues')
          .of(product)
          .loadMany();

      const propertyValuesIDs = productPropertiesValues.map(
        (value) => value.id,
      );

      const propertyValuesWithTypes =
        await this.propertyValueService.findWithTypeByIDs(propertyValuesIDs);

      product.properties = await this.productPropertiesUtils.mapProperties(
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

    const propertyValuesIDs = product.propertyValues.map((value) => value.id);

    const propertyValuesWithTypes =
      await this.propertyValueService.findWithTypeByIDs(propertyValuesIDs);

    product.properties = await this.productPropertiesUtils.mapProperties(
      propertyValuesWithTypes,
    );

    return product;
  }

  async remove(id: number): Promise<boolean> {
    const product = await this.productsRepo.findOne(id);

    if (!product) {
      throw new BadRequestException(`Product with id "${id}" does not exist`);
    }

    await this.productsRepo.delete(id);
    return true;
  }
}
