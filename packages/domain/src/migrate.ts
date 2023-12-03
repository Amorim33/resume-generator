import { pool } from './database';

import migrations from './migrations';

const runMigrations = async () => {
  migrations.forEach(async (migration) => {
    await pool.transaction(async (connection) => {
      await connection.query(migration);
    });
  });
};

runMigrations();
