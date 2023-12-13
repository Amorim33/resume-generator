// https://github.com/vitest-dev/vitest/issues/1575#issuecomment-1439286286
export const setup = () => {
  process.env.NODE_ENV = 'test';
  process.env.MOCK_DATABASE = 'true';
  process.env.DATABASE_URL = 'postgres://localhost:5432/mock';
  process.env.OPENAI_API_KEY = 'mock';
};
