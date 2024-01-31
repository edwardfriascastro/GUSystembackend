import { Column } from 'typeorm';
import { Field, InterfaceType } from 'type-graphql';
import { IEntity } from './IEntity';

@InterfaceType({ implements: IEntity })
export abstract class INameableEntity extends IEntity {
  @Field()
  @Column()
  public name?: string;
}
