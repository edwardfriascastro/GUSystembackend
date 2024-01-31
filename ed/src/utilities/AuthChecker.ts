import { AuthCheckerInterface, ResolverData } from 'type-graphql';
import { GUSystemContext } from '../apollo';
import { GraphQLError } from 'graphql';
import { Service } from 'typedi';
import { ClientService } from '../services/ClientService';

@Service()
export class AuthChecker implements AuthCheckerInterface<GUSystemContext> {
  constructor(private readonly clientService: ClientService) {}

  async check(
    { root, args, context, info }: ResolverData<GUSystemContext>,
    roles: string[]
  ): Promise<boolean> {
    if (!context.client) {
      throw new GraphQLError('Cliente no encontrado!', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }

    const client = await this.clientService.getClientByEmail(context.client.email);

    if (!client) {
      throw new GraphQLError('Cliente no encontrado!', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }

    return true;
  }
}
