import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Busca as últimas 5 vendas salvas no banco
    const result = await pool.query(
      "SELECT email, status, created_at FROM tokens ORDER BY created_at DESC LIMIT 5"
    );

    return res.status(200).json({
      message: "Conexão com banco OK!",
      total_encontrado: result.rows.length,
      ultimas_vendas: result.rows
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Erro ao conectar no banco", 
      detalhes: error.message 
    });
  }
}
