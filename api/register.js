import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, nome, senha, email } = req.body;

  try {
    // 1. Validar o token novamente
    const tokenCheck = await pool.query(
      'SELECT status FROM tokens WHERE token = $1 AND email = $2',
      [token, email]
    );

    if (tokenCheck.rows.length === 0 || tokenCheck.rows[0].status === 'used') {
      return res.status(400).json({ error: 'Token inválido ou já utilizado' });
    }

    // 2. Criar o usuário
    // Nota: Em produção, você deve usar hash de senha (ex: bcrypt)
    await pool.query(
      'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3)',
      [nome, email, senha]
    );

    // 3. Marcar token como usado
    await pool.query(
      "UPDATE tokens SET status = 'used' WHERE token = $1",
      [token]
    );

    return res.status(200).json({ message: 'Cadastro realizado com sucesso' });
  } catch (error) {
    console.error('Erro no registro:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Este email já possui cadastro. Faça login.' });
    }
    return res.status(500).json({ error: 'Erro interno ao realizar cadastro' });
  }
}
