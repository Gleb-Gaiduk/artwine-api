import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@ObjectType()
@Entity()
export class User {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: false })
  isActivated: boolean;

  @HideField()
  @Column({ nullable: true })
  refreshToken?: string;

  @ManyToMany(() => Role, (role) => role.id, {
    nullable: true,
    cascade: true,
  })
  @JoinTable()
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
