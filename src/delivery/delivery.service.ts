import { Injectable } from '@nestjs/common';
import { CreateDeliveryInput } from './dto/create-delivery.input';
import { UpdateDeliveryInput } from './dto/update-delivery.input';

@Injectable()
export class DeliveryService {
  create(createDeliveryInput: CreateDeliveryInput) {
    return 'This action adds a new delivery';
  }

  findAll() {
    return `This action returns all delivery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  update(id: number, updateDeliveryInput: UpdateDeliveryInput) {
    return `This action updates a #${id} delivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
