import { createMockPool, createMockQueryResult } from 'slonik';
import { userQuery } from './user';
import { resumeQuery } from './resume';

export const mockPool = createMockPool({
  query: async (sql) => {
    if (sql.includes('count')) {
      return createMockQueryResult([
        {
          count: 1n,
        },
      ]);
    }

    if (sql.includes('users')) {
      return userQuery;
    }

    if (sql.includes('resumes')) {
      return resumeQuery;
    }

    return createMockQueryResult([]);
  },
});
