import { drizzle } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

let connection: Pool | Client;

if (process.env.NODE_ENV === "production") {
  connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  let globalConnection = global as typeof globalThis & {
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

export type Db = typeof db;
