import * as fs from 'fs';
import * as path from 'path';

export const graphqlSchema = fs.readFileSync(
  path.join(__dirname, '../graphql.graphql'),
  'utf-8',
);
