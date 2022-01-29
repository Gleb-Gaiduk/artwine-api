import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from '../../address/entities/address.entity';

@ObjectType()
@Entity()
export class Delivery {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToOne(() => Courier, { cascade: true })
  // @JoinColumn()
  // courier: Courier;

  // @OneToOne(() => OrderStatus, { cascade: true })
  // @JoinColumn()
  // status: OrderStatus;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  address: Address;

  // @OneToOne(() => Order, (order) => order.delivery)
  // @JoinColumn()
  // order: Order;
}
