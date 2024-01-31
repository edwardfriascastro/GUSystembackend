import { ArgumentValidationError, buildSchema } from 'type-graphql';
import { getResolvers } from './resolvers';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import jwt from 'jsonwebtoken';
import { GraphQLFormattedError } from 'graphql/error';
import { unwrapResolverError } from '@apollo/server/errors';
import { ValidationError } from './errors/ValidationError';
import { AuthChecker } from './utilities/AuthChecker';
import { Container } from 'typedi';

export interface GUSystemContext {
  client: {
    email: string;
    token: string;
  };
}

export class Apollo {
  static async initialize() {
    const resolvers = await getResolvers<unknown>();
    const schema = await buildSchema({
      resolvers,
      validate: { forbidUnknownValues: false },
      authChecker: AuthChecker,
      container: Container,
    });

    const server = new ApolloServer<GUSystemContext>({
      schema,
      formatError: Apollo.customFormatError,
    });

    const { url } = await startStandaloneServer<GUSystemContext>(server, {
      listen: { port: parseInt(process.env.BACKEND_PORT) },
      context: async ({ req }) => {
        const token = req.headers.authorization || '';
        const sanitizedToken = token.replace('Bearer', '');
        return {
          client: sanitizedToken ? Apollo.getClient(sanitizedToken) : null,
        };
      },
    });

    console.log(`🚀  Server ready at: ${url}`);
  }

  public static customFormatError(
    formattedError: GraphQLFormattedError,
    error: unknown
  ): GraphQLFormattedError {
    const originalError = unwrapResolverError(error);

    if (originalError instanceof ArgumentValidationError) {
      return new ValidationError(originalError.validationErrors);
    }

    return formattedError;
  }

  private static getClient(token: string): {
    email: string;
    token: string;
  } {
    try {
      if (token) {
        try {
          const client = jwt.verify(token, process.env.JWT_SECRET);
          client.token = token;
          return client;
        } catch (error) {
          const decoded = jwt.decode(token);
          return { email: decoded.upn, token };
        }
      }
      console.warn('No Token Provided!');
      return null;
    } catch (error) {
      console.error('An error happened decoding the JWT Token', error);
      return null;
    }
  }
}
