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
import { ProjectInputType } from './inputTypes/ProjectInputType';
import { Project } from '../entities/Project';
import { ProjectService } from '../services/ProjectService';
import { UserService } from '../services/UserService';
import { Service } from 'typedi';

@Service()
@Resolver(Project)
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  @Authorized()
  @Query(() => [Project], {
    description: 'Returns a list of projects',
  })
  async projects(
  ): Promise<Project[]> {
    return await this.projectService.getAll();
  }

  @Authorized()
  @Query(() => Project, {
    description: 'Returns a single project',
  })
  async project(@Arg('projectId') projectId: string): Promise<Project> {
    return await this.projectService.getOne(projectId);
  }

  @Authorized('Administrador')
  @Mutation(() => Project, {
    description: 'Saves a project',
  })
  async saveProject(
    @Ctx() ctx: GUSystemContext,
    @Arg('project') saveProjectInputType: ProjectInputType
  ): Promise<Project> {
    try {
      const users = await this.userService.getAllById(
        saveProjectInputType.usersIds
      );
      return await this.projectService.save({
        ...saveProjectInputType,
        users,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Authorized('Administrador')
  @Mutation(() => ID, {
    description: 'Remove a project',
  })
  async removeProject(@Arg('projectId') projectId: string): Promise<string> {
    try {
     const deleteResult= await this.projectService.remove(projectId);
    if (deleteResult.affected > 0) {
      return projectId;
    }
    throw new Error('Ha ocurrido un error eliminando este proyecto!');
  
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
