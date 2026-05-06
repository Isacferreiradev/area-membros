import pkg from 'pg';
const { Client } = pkg;

async function setupUsersTable() {
  const client = new Client({
    connectionString: "postgresql://postgres.uukdwjkskvivrcmxziyw:fiveM1212%21%21%21.@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
  });

  try {
    await client.connect();
    console.log("Conectado ao Supabase para criar tabela de usuários...");

    // Cria a tabela de usuários
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tabela 'users' criada com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao criar tabela:", err);
  } finally {
    await client.end();
  }
}

setupUsersTable();
