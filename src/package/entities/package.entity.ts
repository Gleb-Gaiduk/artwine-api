import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Package {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @Column()
  imagePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
