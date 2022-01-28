import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { Package } from '../../package/entities/package.entity';
import { Product } from '../../product/entities/product.entity';

@ObjectType()
@Entity()
export class OrderProduct {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  productAmount: number;

  @Column()
  orderId: number;
  @ManyToOne(() => Order, (order) => order.products)
  order: Order;

  @Column()
  productId: number;
  @ManyToOne(() => Product, { cascade: true })
  product: Product;

  @ManyToMany(() => Package, { cascade: true })
  @JoinTable()
  packages: Package[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
