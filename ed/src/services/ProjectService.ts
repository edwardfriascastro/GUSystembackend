import { Service } from 'typedi';
import { GUSystemDataSource } from '../datasource';
import { Project } from '../entities/Project';

@Service()
export class ProjectService {
  public async getAll() {
    return await GUSystemDataSource.manager.find(Project, {
      order: {
        name: 'ASC',
      },
      relations: this.getRelations(),
    });
  }

  public async getOne(projectId: string) {
    return GUSystemDataSource.manager.findOne(Project, {
      where: {
        id: projectId,
      },
      order: {name: 'ASC'},
      relations: this.getRelations(),
    });
  }

  public async save(project: Partial<Project>) {
    const savedProject = await GUSystemDataSource.manager.save(Project, project);

    return this.getOne(savedProject.id);
  }

  public async remove(projectId: string) {
    return GUSystemDataSource.manager.delete(Project, projectId);
  }
  private getRelations() {
    return {
      users:true,
      clientCreator:true,
    };
  }
}
