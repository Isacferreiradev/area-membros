import pkg from 'pg';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS e Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const payload = req.body;
    
    // 🔍 LOG DE SEGURANÇA: Salva o que recebemos para depuração
    console.log('📦 Webhook Recebido:', JSON.stringify(payload, null, 2));

    // 🕵️ MAPEAMENTO EXTREMO: Tenta encontrar o e-mail de todas as formas possíveis
    // Adicionei mais campos comuns em plataformas brasileiras
    const email = 
      payload.customer?.email || 
      payload.email || 
      payload.data?.customer?.email || 
      payload.client_email || 
      payload.customer_email ||
      payload.payer_email ||
      (payload.data && payload.data.email);

    const name = 
      payload.customer?.name || 
      payload.name || 
      payload.customer_name || 
      'Cliente TEA';

    // 🆘 SE NÃO ENCONTRAR E-MAIL: Envia um alerta para VOCÊ com o erro
    if (!email) {
      console.error('❌ ERRO: E-mail não encontrado no payload da Lowify');
      
      // Alerta para o dono (Você) para sabermos o que a Lowify mandou
      await resend.emails.send({
        from: 'Sistema <entrega@combinetea.online>',
        to: 'aristocrata.black@gmail.com',
        subject: '⚠️ Alerta de Webhook sem E-mail',
        html: `<p>Recebemos um sinal da Lowify, mas não conseguimos achar o e-mail do cliente.</p>
               <pre>${JSON.stringify(payload, null, 2)}</pre>`
      });

      return res.status(200).json({ status: 'error', message: 'E-mail não detectado' });
    }

    const token = uuidv4();
    const frontendUrl = process.env.FRONTEND_URL || 'https://area-membros-nu.vercel.app';
    const magicLink = `${frontendUrl}?token=${token}`;

    // 1. Tenta salvar no banco
    try {
      await pool.query(
        `INSERT INTO access_tokens (email, token, product_id, status) 
         VALUES ($1, $2, $3, 'active')
         ON CONFLICT (email) DO UPDATE SET token = $2, status = 'active'`,
        [email, token, 'venda_real']
      );
    } catch (dbErr) {
      console.error('⚠️ Erro de banco:', dbErr.message);
    }

    // 2. Envia o e-mail para o CLIENTE
    const { data, error } = await resend.emails.send({
      from: 'Combine TEA <entrega@combinetea.online>', 
      to: email,
      subject: 'Seu material chegou! 🚀 (Acesso Liberado)',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f9f9f9; border-radius: 20px;">
          <h1 style="color: #1e293b; text-align: center;">Olá, ${name}!</h1>
          <p style="color: #64748b; text-align: center; font-size: 16px;">Seu acesso está liberado! Clique no botão abaixo para entrar.</p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${magicLink}" style="background-color: #2D8B3E; color: white; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; display: inline-block;">
              ACESSAR MEU MATERIAL AGORA
            </a>
          </div>
          <p style="text-align: center; color: #94a3b8; font-size: 12px;">Link: ${magicLink}</p>
        </div>
      `
    });

    if (error) throw new Error(error.message);

    console.log(`✅ Entrega enviada para ${email}`);
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('❌ Erro Crítico:', err);
    return res.status(200).json({ error: err.message });
  }
}
