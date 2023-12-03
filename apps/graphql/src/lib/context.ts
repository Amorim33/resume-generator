import { YogaInitialContext } from 'graphql-yoga';
import { User, UserLoaders } from '@resume-generator/domain';

export type GraphQLContext = YogaInitialContext & {
  user?: User | null;
  loaders?: UserLoaders;
};
