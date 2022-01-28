import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enums';

@ObjectType()
@Entity()
export class OrderStatus {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: Status;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
