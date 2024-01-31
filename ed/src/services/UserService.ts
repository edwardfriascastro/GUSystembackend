import { Service } from 'typedi';
import { GUSystemDataSource } from '../datasource';
import { User } from '../entities/User';
import { Project } from '../entities/Project';
import { In } from 'typeorm';

@Service()
export class UserService {
  public async getAll() {
    return GUSystemDataSource.manager.find(User, {
      order: {
        firstName: 'ASC',
      },
      cache: {
        id: 'User',
        milliseconds: 1000 * 60 * 60 * 24 * 20, // 20 days
      },
    });
  }

  public async getAllById(userIds: string[]) {
    return GUSystemDataSource.manager.find(User,
      {
        where: {
          id: In(userIds),
        },
    });
  }

  public async getOne(userId: string) {
    return GUSystemDataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
    });
  }

  public async save(user: Partial<User>) {
    GUSystemDataSource.queryResultCache.remove(['User']);
    const savedUser = await GUSystemDataSource.manager.save(User, user);
    return this.getOne(savedUser.id);
  }

  public async checkReferences(userId: string) {
    return GUSystemDataSource.manager.count(Project, {
      where: {
        users: {
          id: userId,
        },
      },
    });
  }

  public async remove(userId: string) {
    return GUSystemDataSource.manager.delete(User, userId);
  }

}
