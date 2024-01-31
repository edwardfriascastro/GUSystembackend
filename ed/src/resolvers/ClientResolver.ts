import {
    Arg,
    Args,
    Authorized,
    Ctx,
    Mutation,
    Query,
    Resolver,
  } from 'type-graphql';
  import { Client } from '../entities/Client';
  import { GUSystemDataSource } from '../datasource';
  import { ClientInputType } from './inputTypes/ClientInputType';
  import { AuthenticatedClient } from './outputTypes/AuthenticatedClient';
  import { ClientService } from '../services/ClientService';
  import bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';
  import { LoginArgs } from './argsTypes/LoginArgs';
  import { GUSystemContext } from '../apollo';
  import { UpdateClientInputType } from './inputTypes/UpdateClientInputType';
  import { In } from 'typeorm';
  import { Service } from 'typedi';
import { Project } from '../entities/Project';
  
  @Service()
  @Resolver(Client)
  export class ClientResolver {
    constructor(private readonly clientService: ClientService) {}
  
    @Mutation(() => AuthenticatedClient, {
      description: 'Logins an client into the system',
    })
    async login(@Args() loginArgs: LoginArgs): Promise<AuthenticatedClient> {
      const client = await GUSystemDataSource.manager.findOne(Client, {
        where: [
          { username: loginArgs.usernameOrEmail },
          { email: loginArgs.usernameOrEmail },
        ],
      });
  
      if (!client) {
        throw new Error('El cliente especificado no existe!');
      }
      const isValid = await bcrypt.compare(loginArgs.password, client.password);
      if (!isValid) {
        throw new Error('Contraseña Incorrecta!');
      }
  
  
      const token = jwt.sign({ email: client.email }, process.env.JWT_SECRET, {
        expiresIn: '1y',
      });
      return {
        token,
        client,
      };
    }
  
    @Authorized()
    @Query(() => AuthenticatedClient, {
      description: 'Returns logged in client details',
    })
    async me(@Ctx() ctx: GUSystemContext): Promise<AuthenticatedClient> {
      const client = await GUSystemDataSource.manager.findOne(Client, {
        where: {
          email: ctx.client.email,
        },
        relations: this.getRelations(),
      });
  
  
      const token = jwt.sign(
        { id: client.id, email: client.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      return {
        token,
        client,
      };
    }
  
    @Authorized('Administrador')
    @Mutation(() => Client, {
      description: 'Saves a new client (password required)',
    })
    async saveClient(@Arg('client') saveClientInputType: ClientInputType): Promise<Client> {
      try {
  
        const client = await GUSystemDataSource.manager.create(Client, {
          ...saveClientInputType,
          password: await bcrypt.hash(saveClientInputType.password, 10),
        });
  
        return await this.clientService.save({
          ...client,
        });
      } catch (error) {
        throw new Error(error.message);
      }
    }
  
    @Authorized('Administrador')
    @Mutation(() => Client, {
      description: 'Updates a  client',
    })
    async updateClient(
      @Arg('client') updateClientInputType: UpdateClientInputType
    ): Promise<Client> {
      try {
        const projects = await GUSystemDataSource.manager.find(Project, {
          where: {
            id: In(updateClientInputType.projectIds),
          },
        });
  
        const client = GUSystemDataSource.manager.create(Client, {
          ...updateClientInputType,
          projects,
        });
  
        return this.clientService.save(client);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  
    @Authorized()
    @Query(() => [Client], {
      description: 'Returns a list of clients',
    })
    async clients(
      @Ctx() ctx: GUSystemContext,
    ): Promise<Client[]> {
      return this.clientService.getAll();
    }
  
    private getRelations() {
      return {
        projects: {users:true},
      };
    }
  }
  