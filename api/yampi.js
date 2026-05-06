import { Resend } from 'resend';

// Inicializa a Resend (Vercel pega do painel de envs)
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Log básico para vermos no painel da Vercel
  console.log('--- NOVA REQUISIÇÃO RECEBIDA ---');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  const body = req.body;
  const yampiSecret = req.headers['x-yampi-token'];
  const localSecret = process.env.YAMPI_SECRET_KEY;

  // 1. Verificação de Segurança (Com log de diagnóstico)
  if (localSecret && yampiSecret !== localSecret) {
    console.error('❌ ERRO: Token da Yampi não bate com o da Vercel.');
    return res.status(401).json({ error: 'Token inválido', debug: { received: yampiSecret, expected: localSecret ? 'definido' : 'vazio' } });
  }

  // 2. Verificação do Evento
  if (body.event === 'order.paid' || body.event === 'sale.approved') {
    const customer = body.data.customer;

    try {
      console.log(`📧 Tentando enviar e-mail para: ${customer.email}`);
      
      const { data, error } = await resend.emails.send({
        from: 'Raiz Bíblica <entrega@raizbiblica.online>',
        to: [customer.email],
        subject: 'Seu acesso ao Raiz Bíblica chegou! 🙌',
        html: `<h1>Bem-vindo!</h1><p>Acesse seu portal: https://area-membros-nu.vercel.app/</p>`
      });

      if (error) {
        console.error('❌ ERRO RESEND:', error);
        return res.status(403).json({ success: false, error });
      }

      console.log('✅ SUCESSO: E-mail enviado!');
      return res.status(200).json({ success: true, id: data.id });
      
    } catch (err) {
      console.error('❌ ERRO NO PROCESSO:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(200).json({ message: 'Evento ignorado', event: body.event });
}
