import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddressService } from './address.service';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { Address } from './entities/address.entity';

@Resolver(() => Address)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Mutation(() => Address)
  createAddress(
    @Args('createAddressInput') createAddressInput: CreateAddressInput,
  ): Promise<Address> {
    return this.addressService.create(createAddressInput);
  }

  // @Query(() => [Address], { name: 'address' })
  // findAll() {
  //   return this.addressService.findAll();
  // }

  @Query(() => Address, { name: 'address' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Address> {
    return this.addressService.findOne(id);
  }

  @Mutation(() => Address)
  updateAddress(
    @Args('updateAddressInput') updateAddressInput: UpdateAddressInput,
  ): Promise<Address> {
    return this.addressService.update(
      updateAddressInput.id,
      updateAddressInput,
    );
  }

  @Mutation(() => Address)
  removeAddress(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.addressService.remove(id);
  }
}
