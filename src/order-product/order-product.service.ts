import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
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
    private readonly orderProductsRepo: Repository<OrderProduct>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

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
    orderId: string,
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

  async getTotalPriceByOrderId(orderId: string): Promise<number> {
    const orderProducts = await this.orderProductsRepo.find({
      where: { orderId },
      relations: ['product'],
    });

    return orderProducts.reduce(
      (initial, current) =>
        initial + Number(current.productAmount) * Number(current.product.price),
      0,
    );
  }

  async mapOrderProductsWithProductEntities(
    orderEntity: Order,
    orderProductsIDs: number[],
  ): Promise<OrderProduct[]> {
    const productsData = await this.productRepo.findByIds(orderProductsIDs, {
      relations: ['category'],
    });

    const productsWithMappedData = orderEntity.products.map((orderProduct) => {
      const mappedProductData = productsData.find(
        (product) => product.id === orderProduct.productId,
      );
      return { ...orderProduct, product: mappedProductData };
    });

    return productsWithMappedData;
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
