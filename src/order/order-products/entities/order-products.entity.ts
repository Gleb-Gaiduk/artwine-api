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

  @Column()
  productAmount: number;

  @ManyToOne(() => Order, { cascade: true })
  order: Order;

  @ManyToOne(() => Product, { cascade: true })
  Product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
