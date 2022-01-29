import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity()
export class Address {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  @Field()
  userId: number;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  homeNumber: string;

  @Column()
  flatNumber?: string;

  @Column()
  postalIndex: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
