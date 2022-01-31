import { BadRequestException, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionFor } from 'nest-transact';
import { Repository } from 'typeorm';
import { OrderProduct } from '../order-product/entities/order-product.entity';
import { OrderProductService } from '../order-product/order-product.service';
import { Product } from '../product/entities/product.entity';
import { UserService } from '../user/user.service';
import { EntityQueryInput } from '../utils/dto/entity-query.input';
import { generateNumericId, mapPropsToEntity } from '../utils/utils-functions';
import { PackageService } from './../package/package.service';
import { PaginateService } from './../utils/paginate/paginate.service';
import { CreateOrderInput } from './dto/create-order.input';
import { Order } from './entities/order.entity';
import { Status } from './order-status/enums';
import { OrderStatusService } from './order-status/order-status.service';

@Injectable()
export class OrderService extends TransactionFor<OrderService> {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductsRepo: Repository<OrderProduct>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private readonly usersService: UserService,
    private readonly orderProductService: OrderProductService,
    private readonly orderStatusService: OrderStatusService,
    private readonly packageService: PackageService,
    private readonly paginateService: PaginateService,

    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async create(createOrderInput: CreateOrderInput): Promise<Order> {
    const existingUser = await this.usersService.findOne(
      createOrderInput.userId,
    );

    if (!existingUser) {
      throw new BadRequestException(
        `Order creating failed: user with the id ${createOrderInput.userId} doesn't exist`,
      );
    }

    const { productSets } = createOrderInput;
    const orderId = generateNumericId();
    const orderStatus = await this.orderStatusService.findOneByTitle(
      Status.PLACED,
    );

    const order = new Order();
    const orderProps = {
      id: orderId,
      user: existingUser,
      status: orderStatus,
      comment: createOrderInput.comment || null,
      totalPrice: 0,
      // delivery: ;
    };

    const orderWithProps = mapPropsToEntity<typeof orderProps, Order>(
      orderProps,
      order,
    );

    await this.ordersRepo.save(orderWithProps);

    for (const productSet of productSets) {
      await this.orderProductService.saveOrderProductSet(orderId, productSet);
    }

    const productPackageIDs = productSets.map((set) => set.packageId);
    const totalPackagePrice = await this.packageService.getTotalPriceByIDs(
      productPackageIDs,
    );
    const totalProductsPrice =
      await this.orderProductService.getTotalPriceByOrderId(orderId);

    const existedOrder = await this.ordersRepo.findOne(orderId);
    existedOrder.totalPrice = totalPackagePrice + totalProductsPrice;
    await this.ordersRepo.save(existedOrder);

    const orderWithRelations = await this.ordersRepo.findOne(orderId, {
      relations: ['user', 'status', 'products'],
    });
    const orderProductsIDs = orderWithRelations.products.map(
      (product) => product.productId,
    );
    const productsWithMappedData =
      await this.orderProductService.mapOrderProductsWithProductEntities(
        orderWithRelations,
        orderProductsIDs,
      );
    orderWithRelations.products = productsWithMappedData;

    return orderWithRelations;
  }

  async findAll(queryOptions: EntityQueryInput) {
    const { results, total } =
      await this.paginateService.findAllPaginatedWithFilters<Order>(
        this.ordersRepo,
        queryOptions,
      );
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }

  // update(id: number, updateOrderInput: UpdateOrderInput) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
