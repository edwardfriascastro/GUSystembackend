import { Length } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class LoginArgs {
  @Field()
  usernameOrEmail: string;

  @Field()
  @Length(6, 20, { message: 'Password must have between 6 and 20 characters' })
  password: string;
}
