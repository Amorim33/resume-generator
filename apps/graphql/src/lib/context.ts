import { YogaInitialContext } from 'graphql-yoga';
import { User, UserLoaders } from '@resume-generator/domain';
import { Logger } from 'pino';

export type GraphQLContext = YogaInitialContext & {
  user?: User | null;
  loaders?: UserLoaders;
  logger?: Logger;
};
