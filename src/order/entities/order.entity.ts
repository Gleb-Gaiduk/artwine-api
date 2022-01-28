import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { OrderStatus } from '../order-status/entities/order-status.entity';
import { OrderProduct } from './../../order-product/entities/order-product.entity';

@ObjectType()
@Entity()
export class Order {
  @Field(() => ID)
  @PrimaryColumn({ type: 'bigint', unique: true })
  id: number;

  @ManyToOne(() => User, { cascade: true })
  user: User;

  @OneToOne(() => OrderStatus)
  @JoinColumn()
  status: OrderStatus;

  @Column({ nullable: true })
  comment?: string;

  @OneToMany(() => OrderProduct, (products) => products.orderId, {
    cascade: true,
  })
  products: OrderProduct[];

  @Column('decimal', { precision: 6, scale: 2 })
  totalPrice: number;

  // @OneToOne(() => Delivery, (delivery) => delivery.order, { cascade: true })
  // @JoinColumn()
  // delivery: Delivery;

  @Column({ nullable: true })
  deliveredAt?: Date;

  @Column({ nullable: true })
  canceledAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
