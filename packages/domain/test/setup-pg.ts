import { execSync } from 'child_process';

export const setup = async () => {
  const url =
    process.env.DATABASE_URL ??
    'postgres://resume-generator:resume-generator@localhost:54321/resume-generator';
  process.env.DATABASE_URL = url;
  execSync(`DATABASE_URL=${url} pnpm --filter domain migrate`, {
    stdio: 'inherit',
  });
};
