import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const body = req.body;
  const customer = body.data?.customer;

  try {
    // Teste simplificado ao máximo para Produção
    const result = await resend.emails.send({
      from: 'Raiz Bíblica <entrega@raizbiblica.online>',
      to: [customer.email || 'aristocrata.black@gmail.com'],
      subject: 'Teste de Produção Vercel',
      html: `<h1>Funcionando!</h1>`
    });

    // Se a Resend retornar erro, a gente entrega ele pro terminal
    if (result.error) {
      return res.status(400).json({ success: false, resendError: result.error });
    }

    return res.status(200).json({ success: true, resendData: result.data });

  } catch (err) {
    return res.status(500).json({ success: false, codeError: err.message });
  }
}
