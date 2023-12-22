import { sql } from 'slonik';
import { pool } from '../../../database';
import { resumeMock } from '../../../mock/resume';
import { userMock } from '../../../mock/user';
import { userSchema } from '../../../modules/user/dto/user-schema';
import { Resume, resumeSchema } from '../dto/resume-schema';
import { createResumeLoaders } from '../resume-loader';

const loaders = createResumeLoaders();

let resume: Resume;

beforeEach(async () => {
  await pool.connect(async (connection) => {
    await connection.query(sql.unsafe`
        BEGIN;
    `);
  });

  const user = await pool.connect((connection) => {
    return connection.one(sql.type(userSchema)`
        INSERT INTO users (email, name, contact, about)
        VALUES (
        ${userMock.email},
        ${userMock.name},
        ${userMock.contact},
        ${userMock.about}
        )
        RETURNING *;
    `);
  });

  resume = await pool.connect((connection) => {
    return connection.one(sql.type(resumeSchema)`
        INSERT INTO resumes (user_id, html)
        VALUES (
        ${user.id},
        ${resumeMock.html}
        )
        RETURNING *;
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

it('loads a resume by id', async () => {
  expect(await loaders.loaderById.load(resume.id)).toEqual(resume);
});

it('loads resumes by user id', async () => {
  const connection = await loaders.loaderByUserId.loadConnection(
    resume.user_id,
    {
      first: 1,
    },
  );

  expect(connection).toEqual({
    count: 0n,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: expect.any(String),
      endCursor: expect.any(String),
    },
    edges: [
      {
        cursor: expect.any(String),
        id: resume.id,
        html: resume.html,
        user_id: resume.user_id,
        created_at: resume.created_at,
        node: {
          ...resume,
          s1: [
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/),
          ],
        },
        s1: [
          expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/),
        ],
      },
    ],
  });
});
