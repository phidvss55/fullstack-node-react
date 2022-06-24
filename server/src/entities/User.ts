import { ObjectType, Field, ID } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn() // syntax of typeorm
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 0 })
  tokenVersion!: number;
  
  // email: string;
  // firstName: string;
  // lastName: string;
  // createdAt: Date;
  // updatedAt: Date;
}