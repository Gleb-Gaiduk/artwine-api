import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductProperty } from '../product-property/entities/product-property.entity';
import { ProductPropertyValue } from '../product-property/product-property-value/entities/product-property-value.entity';
import { ProductCategory } from './../product-category/entities/product-category.entity';

@ObjectType()
@Entity()
export class Product {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imagePath: string;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  properties: ProductProperty[];

  @ManyToOne(() => ProductCategory, { cascade: true })
  @JoinColumn()
  // "categoryId" column
  category: ProductCategory;

  @HideField()
  @ManyToMany(() => ProductPropertyValue, { cascade: true })
  @JoinTable()
  propertyValues: ProductPropertyValue[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
