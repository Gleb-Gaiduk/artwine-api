import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from '../../address/entities/address.entity';
import { Order } from '../../order/entities/order.entity';
import { OrderStatus } from './../../order/order-status/entities/order-status.entity';

@ObjectType()
@Entity()
export class Delivery {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToOne(() => Courier, { cascade: true })
  // @JoinColumn()
  // courier: Courier;

  @OneToOne(() => OrderStatus, { cascade: true })
  @JoinColumn()
  status: OrderStatus;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  address: Address;

  @OneToOne(() => Order, (order) => order.delivery)
  @JoinColumn()
  order: Order;
}
