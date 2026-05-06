import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ valid: false, error: 'Token não fornecido' });
    }

    const query = `
      SELECT email, status 
      FROM tokens 
      WHERE token = $1
    `;
    const result = await pool.query(query, [token]);
 
    if (result.rows.length === 0) {
      return res.status(200).json({ valid: false, error: 'Link de acesso inválido' });
    }
 
    const tokenData = result.rows[0];
 
    if (tokenData.status === 'used') {
      return res.status(200).json({ valid: false, error: 'Token já utilizado' });
    }

    // Retorna apenas que é válido, sem marcar como usado ainda
    return res.status(200).json({ valid: true, email: tokenData.email });
  } catch (error) {
    console.error('Erro na validação:', error);
    return res.status(500).json({ valid: false, error: 'Erro interno no servidor' });
  }
}
