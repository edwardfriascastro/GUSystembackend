import { Field, ID, ObjectType } from 'type-graphql';
import { Client } from '../../entities/Client';

@ObjectType()
export class AuthenticatedClient {
  @Field(() => ID)
  public readonly token!: string;

  @Field(() => Client)
  public client: Client;
}
