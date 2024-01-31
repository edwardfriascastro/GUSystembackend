import { Service } from 'typedi';
import { GUSystemDataSource } from '../datasource';
import { Client } from '../entities/Client';

@Service()
export class ClientService {
  public async getClientByEmail(email: string) {
    return GUSystemDataSource.manager.findOne(Client, {
      where: {
        email,
      },
      relations: this.getRelations(),
    });
  }

  public async getAll() {
    return await GUSystemDataSource.manager.find(Client, {
      order: {
        firstName: 'ASC',
      },
      relations: this.getRelations(),
    });
  }

  public async getOne(clientId: string) {
    return GUSystemDataSource.manager.findOne(Client, {
      where: {
        id: clientId,
      },
      relations: this.getRelations(),
    });
  }

  public async save(client: Partial<Client>) {
    const savedClient = await GUSystemDataSource.manager.save(Client, client);
    return this.getOne(savedClient.id);
  }

  private getRelations() {
    return {
        projects: {
            users : true,
        },
    };
  }
}
