import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Database = NodePgDatabase<typeof schema>;

const globalForDatabase = globalThis as unknown as {
  cactusPool?: Pool;
  cactusDatabase?: Database;
};

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to connect to PostgreSQL.");
  }

  return connectionString;
}

export function getDatabase(): Database {
  if (globalForDatabase.cactusDatabase) {
    return globalForDatabase.cactusDatabase;
  }

  const pool = new Pool({
    connectionString: getConnectionString(),
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    ssl:
      process.env.DATABASE_SSL === "require"
        ? { rejectUnauthorized: false }
        : undefined,
  });
  const database = drizzle(pool, { schema });

  // One bounded pool per server process, including production requests.
  globalForDatabase.cactusPool = pool;
  globalForDatabase.cactusDatabase = database;

  return database;
}
