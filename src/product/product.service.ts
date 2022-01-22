import { BadRequestException, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionFor } from 'nest-transact';
import { Repository } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
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
      let existingPropertyType = await this.propertyTypeService.findOneByTitle(
        productProperty.propertyType,
      );

      if (!existingPropertyType) {
        existingPropertyType = await this.propertyTypeService.create({
          title: productProperty.propertyType,
        });
      }

      // Push if there is no such existed relation

      category_propertyTypeIntersections.push(existingPropertyType);

      let existingPropertyValue =
        await this.propertyValueService.findOneByTitle(
          productProperty.propertyValue,
        );

      if (!existingPropertyValue) {
        existingPropertyValue = await this.propertyValueService.create({
          title: productProperty.propertyValue,
          description: productProperty.propertyDescription || null,
        });
      }

      const hasTypeValueCombination =
        existingPropertyValue.type &&
        existingPropertyValue.type.title === existingPropertyType.title;

      if (!hasTypeValueCombination) {
        existingPropertyValue.type = existingPropertyType;
        await this.propertyValueService.save(existingPropertyValue);
      }

      product_propertyValueIntersections.push(existingPropertyValue);
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

  // findAll() {
  //   return `This action returns all product`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} product`;
  // }

  // update(id: number, updateProductInput: UpdateProductInput) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
