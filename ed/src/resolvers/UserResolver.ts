import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { GUSystemContext } from '../apollo';
import { User } from '../entities/User';
import { UserService } from '../services/UserService';
import { Service } from 'typedi';
import { UserInputType } from './inputTypes/UserInputType';

@Service()
@Resolver(User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Authorized()
  @Query(() => [User], {
    description: 'Returns a list of users',
  })
  async users(
  ): Promise<User[]> {
    return this.userService.getAll();
  }

  @Authorized()
  @Query(() => User, {
    description: 'Returns a single user',
  })
  async user(@Arg('userId') userId: string): Promise<User> {
    return await this.userService.getOne(userId);
  }

  @Authorized()
  @Mutation(() => User, {
    description: 'Saves a new user',
  })
  async saveUser(
    @Arg('user') userInputType: UserInputType,
    @Ctx() ctx: GUSystemContext
  ): Promise<User> {
    try {
      const savedUser = await this.userService.save(userInputType);
      return this.userService.getOne(savedUser.id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Authorized()
  @Mutation(() => ID, {
    description: 'Deletes a user',
  })
  async removeUser(
    @Ctx() ctx: GUSystemContext,
    @Arg('userId') userId: string
  ): Promise<string> {
    const deleteResult = await this.userService.remove(userId);

    if (deleteResult.affected > 0) {
      return userId;
    }

    throw new Error('Ha ocurrido un error eliminando este usuario!');
  }
}
