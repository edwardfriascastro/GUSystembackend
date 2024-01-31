import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Project } from './Project';
import { Field, ObjectType } from 'type-graphql';
import { IEntity } from '../interfaces/IEntity';

@Entity()
@ObjectType({ implements: IEntity })
export class Client extends IEntity {
  @Field()
  @Column()
  public username!: string;

  @Field()
  @Column()
  public firstName!: string;

  @Field()
  @Column()
  public lastName!: string;

  @Column()
  public password!: string;

  @Field()
  @Column({ unique: true })
  public email!: string;

  @Field(() => [Project], { nullable: true })
  @OneToMany(() => Project, (project) => project.clientCreator, { nullable: true })
  @JoinTable()
  public projects?: Project[];
}
