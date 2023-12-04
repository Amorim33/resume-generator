import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const graphqlSchema = readFileSync(
  join(__dirname, '../graphql.graphql'),
  'utf-8',
);
