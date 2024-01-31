import { Field, InputType } from 'type-graphql';
import { User } from '../../entities/User';

@InputType()
export class UserInputType implements Partial<User> {
  @Field({ nullable: true })
  id?: string;

  @Field()
  public username!: string;

  @Field()
  public firstName!: string;

  @Field()
  public lastName!: string;

}
