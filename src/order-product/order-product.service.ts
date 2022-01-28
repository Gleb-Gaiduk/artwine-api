import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mapPropsToEntity } from '../utils/utils-functions';
import { PackageService } from './../package/package.service';
import { CreateOrderProductServiceInput } from './dto/create-order-product-service.input';
import { CreateOrderProductSetInput } from './dto/create-order-product-set.input';
import { OrderProduct } from './entities/order-product.entity';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductsRepo: Repository<OrderProduct>,

    private readonly packageService: PackageService,
  ) {}

  async create(
    createOrderProductInput: CreateOrderProductServiceInput,
  ): Promise<OrderProduct> {
    const orderProduct = new OrderProduct();
    const orderProductWithInputProps = mapPropsToEntity<
      CreateOrderProductServiceInput,
      OrderProduct
    >(createOrderProductInput, orderProduct);
    return await this.orderProductsRepo.save(orderProductWithInputProps);
  }

  async saveOrderProductSet(
    orderId: number,
    productSet: CreateOrderProductSetInput,
  ): Promise<void> {
    const packageInstance = await this.packageService.findOne(
      productSet.packageId,
    );

    for (const product of productSet.products) {
      const orderProduct = await this.create({ orderId, ...product });
      orderProduct.packages = [packageInstance];
      await this.orderProductsRepo.save(orderProduct);
    }
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
