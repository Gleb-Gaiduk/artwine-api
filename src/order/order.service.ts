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
import { getNumericStringID, mapPropsToEntity } from '../utils/utils-functions';
import { PackageService } from './../package/package.service';
import { PaginateService } from './../utils/paginate/paginate.service';
import { CreateOrderInput } from './dto/create-order.input';
import { Order } from './entities/order.entity';
import { PaginatedOrders } from './entities/paginated-orders.entity';
import { Status } from './order-status/enums';
import { OrderStatusService } from './order-status/order-status.service';

@Injectable()
export class OrderService extends TransactionFor<OrderService> {
  constructor(
    @InjectRepository(Order)
    private readonly _ordersRepo: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly _orderProductsRepo: Repository<OrderProduct>,
    @InjectRepository(Product)
    private readonly _productRepo: Repository<Product>,
    private readonly _usersService: UserService,
    private readonly _orderProductService: OrderProductService,
    private readonly _orderStatusService: OrderStatusService,
    private readonly _packageService: PackageService,
    private readonly _paginateService: PaginateService,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async create(createOrderInput: CreateOrderInput): Promise<Order> {
    const existingUser = await this._usersService.findOne(
      createOrderInput.userId,
    );

    if (!existingUser) {
      throw new BadRequestException(
        `Order creating failed: user with the id ${createOrderInput.userId} doesn't exist`,
      );
    }

    const { productSets } = createOrderInput;
    const orderId = getNumericStringID();
    const orderStatus = await this._orderStatusService.findOneByTitle(
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
    await this._ordersRepo.save(orderWithProps);

    for (const productSet of productSets) {
      await this._orderProductService.saveOrderProductSet(orderId, productSet);
    }

    const existingOrder = await this._ordersRepo.findOne(orderId);
    const productPackageIDs = productSets.map((set) => set.packageId);
    existingOrder.totalPrice = await this._findTotalPrice(
      orderId,
      productPackageIDs,
    );
    await this._ordersRepo.save(existingOrder);

    const orderWithRelations = await this._ordersRepo.findOne(orderId, {
      relations: [
        'user',
        'status',
        'products',
        'products.packages',
        'products.product',
        'products.product.category',
      ],
    });

    return orderWithRelations;
  }

  async findAll(queryOptions: EntityQueryInput): Promise<PaginatedOrders> {
    // TODO: paginated orders
    // TODO: order total price calculation using subscribers
    // https://orkhan.gitbook.io/typeorm/docs/listeners-and-subscribers

    // Below problem: can not find 2-level nested relations but works with 1 level well.
    // const { results, total } =
    //   await this._paginateService.findPaginatedWithFilters<Order>({
    //     repository: this._ordersRepo,
    //     queryOptions,
    //     alias: 'order',
    //     relations: [
    //       'products.product',
    //       'user',
    //       'status',
    //       'products',
    //       'products.packages',
    //       'products.product.category',
    //     ],
    //   });

    const [results, total] = await this._ordersRepo.findAndCount({
      relations: [
        'user',
        'status',
        'products',
        'products.packages',
        'products.product',
        'products.product.category',
      ],
    });

    return {
      results,
      total,
    };
  }

  private async _findTotalPrice(
    orderId: string,
    packageIDs: number[],
  ): Promise<number> {
    const totalPackagePrice = await this._packageService.getTotalPriceByIDs(
      packageIDs,
    );
    const totalProductsPrice =
      await this._orderProductService.getTotalPriceByOrderId(orderId);

    return totalPackagePrice + totalProductsPrice;
  }

  async findOne(id: string): Promise<Order> {
    const orderWithRelations = await this._ordersRepo.findOne(id, {
      relations: [
        'user',
        'status',
        'products',
        'products.packages',
        'products.product',
        'products.product.category',
      ],
    });

    if (!orderWithRelations) {
      throw new BadRequestException(`Order with id ${id} doesn't exist.`);
    }

    return orderWithRelations;
  }

  // update(id: number, updateOrderInput: UpdateOrderInput) {
  //   return `This action updates a #${id} order`;
  // }

  async remove(id: string): Promise<boolean> {
    const existingOrder = await this._ordersRepo.findOne(id);

    if (!existingOrder) {
      throw new BadRequestException(`Order with id ${id} doesn't exist.`);
    }

    await this._orderProductService.remove(id);
    await this._ordersRepo.delete(id);

    return true;
  }
}
