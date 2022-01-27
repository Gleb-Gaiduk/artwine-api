import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { OrderStatus } from '../order-status/entities/order-status.entity';
import { Delivery } from './../../delivery/entities/delivery.entity';

@ObjectType()
@Entity()
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { cascade: true })
  user: User;

  @OneToOne(() => OrderStatus)
  @JoinColumn()
  status: OrderStatus;

  @Column()
  comment?: string;

  @Column('decimal', { precision: 6, scale: 2 })
  totalPrice: number;

  @OneToOne(() => Delivery, (delivery) => delivery.order, { cascade: true })
  @JoinColumn()
  delivery: Delivery;

  @Column()
  deliveredAt: Date;

  @Column()
  canceledAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
