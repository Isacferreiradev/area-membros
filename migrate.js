import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS access_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    product_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'revoked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
  );

  -- Indice para buscas rapidas por token
  CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON access_tokens(token);
`;

async function runMigration() {
  try {
    console.log('Criando tabela access_tokens...');
    await pool.query(createTableQuery);
    console.log('Tabela criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
