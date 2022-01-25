import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductPropertyType } from '../../product-property-type/entities/product-property-type.entity';

@ObjectType()
@Entity()
export class ProductPropertyValue {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @HideField()
  @ManyToOne(() => ProductPropertyType, { cascade: true })
  @JoinColumn()
  type?: ProductPropertyType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
