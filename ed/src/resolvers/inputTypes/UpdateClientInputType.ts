import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Client } from '../../entities/Client';

@InputType()
export class UpdateClientInputType implements Partial<Client> {
  @Field({ nullable: true })
  id?: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  username: string;

  @Field()
  @IsEmail({}, { message: 'Invalid Email' })
  email: string;

  @Field(() => [String], { nullable: true })
  projectIds?: string[];

}
