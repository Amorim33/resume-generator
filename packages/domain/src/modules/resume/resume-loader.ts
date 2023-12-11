import { sql } from 'slonik';
import {
  createConnectionLoaderClass,
  createNodeByIdLoaderClass,
} from 'slonik-dataloaders';
import { pool } from '../../database';
import { resumeSchema } from './dto/resume-schema';
import { User } from '../user/dto/user-schema';

const ResumeByIdLoader = createNodeByIdLoaderClass({
  column: {
    name: 'id',
    type: 'uuid',
  },
  query: sql.type(resumeSchema)`
    SELECT
      *
    FROM resumes
  `,
});

const ResumeConnectionLoader = createConnectionLoaderClass({
  query: sql.type(resumeSchema)`
    SELECT
      *
    FROM resumes
  `,
});

/** Actual loader class for loading resumes by user id. */
class ResumeByUserIdLoader extends ResumeConnectionLoader {
  /** Method to load a connection of resumes by user id. */
  public async loadConnection(
    user: User,
    pagination: {
      after?: string | null;
      first?: number | null;
      before?: string | null;
      last?: number | null;
    },
  ) {
    const { after, first, before, last } = pagination;
    return this.load({
      where: ({ user_id }) => sql.fragment`${user_id} = ${user.id}`,
      orderBy: ({ id }) => [[id, 'ASC']],
      cursor: after || before,
      limit: first,
      offset: last,
    });
  }
}

export type ResumeLoaders = {
  loaderById: InstanceType<typeof ResumeByIdLoader>;
  loaderByUserId: InstanceType<typeof ResumeByUserIdLoader>;
};

/**
 * Factory function for instantiating resume loaders.
 *
 * @example
 *   context: (context) => {
 *     return {
 *       ...context,
 *       loaders: {
 *         resume: createResumeLoaders(),
 *       },
 *     };
 *   };
 */
export const createResumeLoaders = (): ResumeLoaders => ({
  loaderById: new ResumeByIdLoader(pool),
  loaderByUserId: new ResumeByUserIdLoader(pool),
});
