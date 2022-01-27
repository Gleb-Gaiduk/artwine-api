import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Product } from './../../../product/entities/product.entity';

@ObjectType()
export class OrderProducts {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  productAmount: number;

  @ManyToOne(() => Order, { cascade: true })
  // orderId
  order: Order;

  @ManyToOne(() => Product, { cascade: true })
  // productId
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
