import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mapPropsToEntity } from '../utils/utils-functions';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  async create(createAddressInput: CreateAddressInput): Promise<Address> {
    const existingUserAddress = await this.findByUserId(
      createAddressInput.userId,
    );

    if (existingUserAddress) {
      throw new BadRequestException(
        `User with the id "${createAddressInput.userId}" already has a saved address`,
      );
    }

    const userAddress = new Address();

    const userAddressWithProps = mapPropsToEntity<CreateAddressInput, Address>(
      createAddressInput,
      userAddress,
    );

    const { id } = await this.addressRepo.save(userAddressWithProps);
    return this.addressRepo.findOne(id, { relations: ['user'] });
  }

  // async findAll() {
  //   return await this.addressRepo.find;
  // }

  async findOne(id: number): Promise<Address> {
    const existingAddress = await this.addressRepo.findOne(id);

    if (!existingAddress) {
      throw new BadRequestException(
        `Address with the id "${id}" does not exist`,
      );
    }
    return await this.addressRepo.findOne(id);
  }

  async update(
    id: number,
    updateAddressInput: UpdateAddressInput,
  ): Promise<Address> {
    const existingUserAddress = await this.addressRepo.findOne(id);

    if (!existingUserAddress) {
      throw new BadRequestException(
        `Address with the id "${id}" does not exist`,
      );
    }

    const updatedAddressWithProps = mapPropsToEntity<
      UpdateAddressInput,
      Address
    >(updateAddressInput, existingUserAddress);

    await this.addressRepo.save(updatedAddressWithProps);
    return await this.addressRepo.findOne(id, { relations: ['user'] });
  }

  async remove(id: number): Promise<boolean> {
    const existingUserAddress = await this.findByUserId(id);

    if (!existingUserAddress) {
      throw new BadRequestException(
        `User with the id "${id}" has no assigned address.`,
      );
    }

    await this.addressRepo.delete(existingUserAddress.id);
    return true;
  }

  async findByUserId(id: number): Promise<Address> {
    return await this.addressRepo.findOne({
      where: { userId: id },
    });
  }
}
