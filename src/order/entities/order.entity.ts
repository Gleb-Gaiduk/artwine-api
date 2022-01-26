import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { OrderStatus } from '../order-status/entities/order-status.entity';

@ObjectType()
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

  @Column({ type: 'real' })
  totalPrice: string;

  @Column()
  deliveredAt: Date;

  @Column()
  canceledAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
