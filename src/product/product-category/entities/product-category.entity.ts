import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductPropertyType } from '../../product-property/product-property-type/entities/product-property-type.entity';

@ObjectType()
@Entity()
export class ProductCategory {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @ManyToMany(() => ProductPropertyType, { cascade: true })
  @JoinTable()
  properties: ProductPropertyType[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
