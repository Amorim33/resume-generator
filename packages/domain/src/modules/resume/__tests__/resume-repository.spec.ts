import { sql } from 'slonik';
import { pool } from '../../../database';
import { resumeMock } from '../../../mock/resume';
import { insertUserQuery } from '../../../mock/user';
import { Resume } from '../dto/resume-schema';
import { createResumeLoaders } from '../resume-loader';
import { createResumeRepository } from '../resume-repository';

const resumeRepository = createResumeRepository(createResumeLoaders());

beforeEach(async () => {
  await pool.connect(async (connection) => {
    await connection.query(sql.unsafe`
        BEGIN;
    `);
  });
});

afterEach(async () => {
  await pool.connect(async (connection) => {
    await connection.query(sql.unsafe`
        ROLLBACK;
    `);
  });
});

it('creates a resume', async () => {
  const insertedUser = await pool.connect((connection) => {
    return connection.one(insertUserQuery);
  });
  const testResume: Omit<Resume, 'id'> = {
    user_id: insertedUser.id,
    html: resumeMock.html,
  };
  const createdResume = await resumeRepository.create(testResume);
  expect(createdResume).toMatchObject(testResume);
});
