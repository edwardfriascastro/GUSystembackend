import { Field, InputType } from 'type-graphql';
import { Project } from '../../entities/Project';

@InputType()
export class ProjectInputType implements Partial<Project> {
  @Field({ nullable: true })
  id?: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  clientCreatorId?: string;

  @Field(() => [String], { nullable: true })
  usersIds: string[];
}
