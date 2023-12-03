import { YogaInitialContext } from 'graphql-yoga';
import { User } from '../__generated__/resolvers-types';

export type GraphQLContext = YogaInitialContext & {
  user: User | null;
};
