import { Column, Entity, ManyToOne, OneToMany,JoinTable, ManyToMany} from 'typeorm';
import { User } from './User';
import { Client } from './Client';
import { Field, ObjectType } from 'type-graphql';
import { IEntity } from '../interfaces/IEntity';

@Entity()
@ObjectType({ implements: IEntity })
export class Project extends IEntity {
  @Field()
  @Column()
  public description!: string;

  @Field()
  @Column()
  public name!: string;

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, (user) => user.projects, { nullable: true })
  public clientCreator?: Client;

  @Column()
  public clientCreatorId!: string;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  public users?: User[];
}
