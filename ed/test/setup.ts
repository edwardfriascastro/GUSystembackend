import { DataSource, DataSourceOptions } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { AuthChecker } from '../src/utilities/AuthChecker';
import { Container } from 'typedi';
import { getResolvers } from '../src/resolvers';
import { ApolloServer } from '@apollo/server';
import { Apollo, GUSystemContext } from '../src/apollo';
import * as dataSources from '../src/datasource';
import { DateUtils } from 'typeorm/util/DateUtils';
import { Seeder } from './utilities/seeder';
import { UserStatus } from '../src/entities/UserStatus';
import { User } from '../src/entities/User';

export let mockedGUSystemContext: GUSystemContext;
export let mockedCurrentDate: string;
export let apolloTestServer: ApolloServer<GUSystemContext>;

beforeAll(async () => {
  const TestDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    cache: true,
    entities: [`${__dirname}/../src/entities/*.ts`],
  } as DataSourceOptions);

  await TestDataSource.initialize();

  Object.defineProperty(dataSources, 'GUSystemDataSource', {
    value: TestDataSource,
  });

  process.env.TZ = 'UTC';

  await Seeder.seed([UserStatus, User]);

  mockedCurrentDate = DateUtils.mixedDateToDatetimeString(
    new Date(1672531200000)
  );

  const resolvers = await getResolvers<unknown>(
    `${__dirname}/../src/resolvers`
  );

  const schema = await buildSchema({
    resolvers,
    validate: { forbidUnknownValues: false },
    authChecker: AuthChecker,
    container: Container,
  });

  apolloTestServer = new ApolloServer<GUSystemContext>({
    schema,
    formatError: Apollo.customFormatError,
  });

  mockedGUSystemContext = {
    user: {
      token: 'token',
      email: 'admin@email.test',
    },
  };
});

afterAll(async () => {
  await dataSources.GUSystemDataSource.destroy();
});
