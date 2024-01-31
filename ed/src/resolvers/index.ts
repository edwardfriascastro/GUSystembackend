import * as fs from 'fs';
import * as path from 'path';
import { NonEmptyArray } from 'type-graphql';

type ResolverClass<T> = { new (): T };

export async function getResolvers<T>(
  dirName?: string
): Promise<NonEmptyArray<ResolverClass<T>>> {
  const directoryPath = dirName ? dirName : `${__dirname}`;

  const files = await fs.promises.readdir(directoryPath);
  const resolverFiles = files.filter(
    (file) => file.endsWith('Resolver.js') || file.endsWith('Resolver.ts')
  );

  const resolvers: ResolverClass<T>[] = [];

  for (const file of resolverFiles) {
    const resolverPath = path.join(directoryPath, file);
    const resolverModule = await import(resolverPath);
    const resolverClass = Object.values(resolverModule)[0] as ResolverClass<T>;
    resolvers.push(resolverClass);
  }

  if (resolvers.length === 0) {
    throw new Error('No resolvers found');
  }

  return resolvers as NonEmptyArray<ResolverClass<T>>;
}
