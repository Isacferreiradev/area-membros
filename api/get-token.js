import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { email, venda, token } = req.query;
    const saleId = venda || token;

    // 1. Busca por ID da Venda (Segurança Máxima - 100% Automático)
    if (saleId && !saleId.includes('{')) {
      const result = await pool.query(
        "SELECT token FROM tokens WHERE sale_id = $1 AND status = 'pending' LIMIT 1",
        [saleId]
      );
      if (result.rows.length > 0) {
        return res.status(200).json({ token: result.rows[0].token });
      }
    }

    // 2. Busca por E-mail (Fallback Seguro - Manual)
    if (email && !email.includes('{')) {
      const result = await pool.query(
        "SELECT token FROM tokens WHERE email = $1 AND status = 'pending' ORDER BY created_at DESC LIMIT 1",
        [email]
      );
      if (result.rows.length > 0) {
        return res.status(200).json({ token: result.rows[0].token });
      }
    }

    // Se não encontrar nada, retorna vazio (Página vai pedir e-mail)
    return res.status(200).json({ token: null });

  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
