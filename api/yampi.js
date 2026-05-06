import { Resend } from 'resend';

// Versão de Diagnóstico Final - Forçando Deploy
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const body = req.body;
  const customer = body.data?.customer;

  console.log('--- EXECUTANDO API DE DIAGNÓSTICO ---');

  try {
    const result = await resend.emails.send({
      from: 'Raiz Bíblica <entrega@raizbiblica.online>',
      to: [customer?.email || 'aristocrata.black@gmail.com'],
      subject: 'Teste de Produção Vercel',
      html: `<h1>Site Atualizado!</h1>`
    });

    if (result.error) {
      console.error('ERRO RESEND:', result.error);
      return res.status(400).json({ success: false, resendError: result.error });
    }

    return res.status(200).json({ success: true, resendData: result.data });

  } catch (err) {
    console.error('ERRO CÓDIGO:', err.message);
    return res.status(500).json({ success: false, codeError: err.message });
  }
}
