import { drizzle } from 'drizzle-orm/node-postgres';
import { Client, Pool } from 'pg';
import * as schema from './schema';

// Disable prefetch as it is not supported for "Transaction" pool mode
let connection: Pool | Client;

if (process.env.NODE_ENV === "production") {
  connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  const globalConnection = global as typeof globalThis & {
    connection: Client;
  };

  if (!globalConnection.connection) {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    (async () => await client.connect())().catch((err) => {
      console.error("Error connecting to the database", err);
    });

    globalConnection.connection = client;
  }

  connection = globalConnection.connection;
}
export const db = drizzle(connection, { schema });