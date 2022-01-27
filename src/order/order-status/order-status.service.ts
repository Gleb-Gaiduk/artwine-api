import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mapPropsToEntity } from '../../utils/utils-functions';
import { CreateOrderStatusInput } from './dto/create-order-status.input';
import { UpdateOrderStatusInput } from './dto/update-order-status.input';
import { OrderStatus } from './entities/order-status.entity';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepo: Repository<OrderStatus>,
  ) {}

  async create(
    createOrderStatusInput: CreateOrderStatusInput,
  ): Promise<OrderStatus> {
    const existingStatus = await this.findOneByTitle(
      createOrderStatusInput.title,
    );

    if (existingStatus) {
      throw new BadRequestException(
        `Order status with the title "${existingStatus.title}" already exists`,
      );
    }

    const newStatus = new OrderStatus();
    const newStatusWithProps = mapPropsToEntity<
      CreateOrderStatusInput,
      OrderStatus
    >(createOrderStatusInput, newStatus);

    return await this.orderStatusRepo.save(newStatusWithProps);
  }

  async findAll(): Promise<OrderStatus[]> {
    return await this.orderStatusRepo.find();
  }

  async findOne(id: number): Promise<OrderStatus> {
    const existingStatus = await this.orderStatusRepo.findOne(id);

    if (!existingStatus) {
      throw new BadRequestException(
        `Order status with the id "${id}" does not exist`,
      );
    }

    return await this.orderStatusRepo.findOne(id);
  }

  async update(
    id: number,
    updateOrderStatusInput: UpdateOrderStatusInput,
  ): Promise<OrderStatus> {
    const existingStatus = await this.orderStatusRepo.findOne(id);

    if (!existingStatus) {
      throw new BadRequestException(
        `Order status with the id "${id}" does not exist`,
      );
    }

    const updatedStatus = mapPropsToEntity<UpdateOrderStatusInput, OrderStatus>(
      updateOrderStatusInput,
      existingStatus,
    );

    return await this.orderStatusRepo.save(updatedStatus);
  }

  async remove(id: number): Promise<boolean> {
    const existingStatus = await this.orderStatusRepo.findOne(id);

    if (!existingStatus) {
      throw new BadRequestException(
        `Order status with the id "${id}" does not exist`,
      );
    }

    await this.orderStatusRepo.delete(id);
    return true;
  }

  async findOneByTitle(title: string): Promise<OrderStatus> {
    return await this.orderStatusRepo.findOne({ where: { title } });
  }
}
