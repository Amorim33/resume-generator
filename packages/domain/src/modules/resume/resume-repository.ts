import { sql } from 'slonik';
import { pool } from '../../database';
import { Resume, resumeSchema } from './dto/resume-schema';
import { ResumeLoaders } from './resume-loader';

/**
 * Factory function to create a resume repository.
 *
 * @example
 *   const resumeRepository = createResumeRepository(loaders);
 *   const resume = await resumeRepository.create(resume);
 */
export const createResumeRepository = (loaders: ResumeLoaders) => ({
  create: async (resume: Omit<Resume, 'id' | 'created_at'>) => {
    const createdResume = await pool.connect(async (connection) => {
      return connection.one(sql.type(resumeSchema)`
        INSERT INTO resumes (user_id, html) VALUES (${resume.user_id}, ${resume.html})
        RETURNING (id)
      `);
    });

    loaders.loaderById.prime(createdResume.id, { ...resume, ...createdResume });

    return { ...resume, ...createdResume };
  },
});
