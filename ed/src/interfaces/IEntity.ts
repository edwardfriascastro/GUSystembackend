import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, InterfaceType } from 'type-graphql';

@InterfaceType()
export abstract class IEntity {
  @Field(() => ID)
  @Column({
    generated: 'uuid',
    primary: true,
    type: 'varchar',
    length: 36,
  })
  public readonly id!: string;

  @Field({ nullable: true })
  @CreateDateColumn()
  public creationDate!: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  public modificationDate: Date;
}
