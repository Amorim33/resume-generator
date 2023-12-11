import { YogaInitialContext } from 'graphql-yoga';
import { ResumeLoaders, User, UserLoaders } from '@resume-generator/domain';
import { Logger } from 'pino';

export type GraphQLContext = YogaInitialContext & {
  user?: User | null;
  loaders: {
    user: UserLoaders;
    resume: ResumeLoaders;
  };
  logger?: Logger;
};
