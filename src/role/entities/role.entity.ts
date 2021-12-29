import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Role {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: UserRoles;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum UserRoles {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  COURIER = 'courier',
  CONTENT_MANAGER = 'content_manager',
}

registerEnumType(UserRoles, {
  name: 'UserRoles',
});
