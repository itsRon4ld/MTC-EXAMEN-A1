import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || '';

// Singleton connection to Neon Serverless Postgres
function createDb() {
  if (!connectionString || connectionString.includes('npg_password')) {
    // Development placeholder / reminder
    console.warn('[DB]: DATABASE_URL no configurada con una instancia real de Neon. Asegúrate de configurar DATABASE_URL en .env.local.');
  }
  const sql = neon(connectionString || 'postgresql://placeholder:placeholder@localhost:5432/db');
  return drizzle(sql, { schema });
}

export const db = createDb();
export type DbInstance = typeof db;
