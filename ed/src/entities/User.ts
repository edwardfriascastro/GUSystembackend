import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Project } from './Project';
import { Field, ObjectType } from 'type-graphql';
import { IEntity } from '../interfaces/IEntity';

@Entity()
@ObjectType({ implements: IEntity })
export class User extends IEntity {
  @Field()
  @Column({ unique: true })
  public username!: string;

  @Field()
  @Column()
  public firstName!: string;

  @Field()
  @Column()
  public lastName!: string;
}
