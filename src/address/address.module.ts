import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressResolver } from './address.resolver';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressResolver, AddressService],
})
export class AddressModule {}
