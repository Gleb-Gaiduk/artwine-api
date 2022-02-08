import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { mapPropsToEntity } from '../utils/utils-functions';
import { PackageService } from './../package/package.service';
import { CreateOrderProductServiceInput } from './dto/create-order-product-service.input';
import { CreateOrderProductSetInput } from './dto/create-order-product-set.input';
import { OrderProduct } from './entities/order-product.entity';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly _orderProductsRepo: Repository<OrderProduct>,
    @InjectRepository(Product)
    private readonly _productRepo: Repository<Product>,
    private readonly _packageService: PackageService,
  ) {}

  async create(
    createOrderProductInput: CreateOrderProductServiceInput,
  ): Promise<OrderProduct> {
    const orderProduct = new OrderProduct();
    const orderProductWithInputProps = mapPropsToEntity<
      CreateOrderProductServiceInput,
      OrderProduct
    >(createOrderProductInput, orderProduct);

    return await this._orderProductsRepo.save(orderProductWithInputProps);
  }

  async saveOrderProductSet(
    orderId: string,
    productSet: CreateOrderProductSetInput,
  ): Promise<void> {
    const packageInstance = await this._packageService.findOne(
      productSet.packageId,
    );

    for (const product of productSet.products) {
      const orderProduct = await this.create({ orderId, ...product });
      orderProduct.packages = [packageInstance];
      await this._orderProductsRepo.save(orderProduct);
    }
  }

  async getTotalPriceByOrderId(orderId: string): Promise<number> {
    const orderProducts = await this._orderProductsRepo.find({
      where: { orderId },
      relations: [ProductService.PRODUCT_RELATION],
    });

    return orderProducts.reduce(
      (initial, current) =>
        initial + Number(current.productAmount) * Number(current.product.price),
      0,
    );
  }

  // findAll() {
  //   return `This action returns all orderProduct`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} orderProduct`;
  // }

  // update(id: number, updateOrderProductInput: UpdateOrderProductInput) {
  //   return `This action updates a #${id} orderProduct`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} orderProduct`;
  // }
}
