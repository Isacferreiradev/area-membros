import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const body = req.body;
  const yampiSecret = req.headers['x-yampi-token'];
  const localSecret = process.env.YAMPI_SECRET_KEY;

  console.log('--- WEBHOOK YAMPI RECEBIDO ---');
  console.log('Evento:', body.event);

  // 1. Segurança
  if (localSecret && yampiSecret !== localSecret) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  // 2. Extração de Dados (Padrão Oficial Yampi: resource.customer.data)
  const resource = body.resource;
  const customer = resource?.customer?.data || body.data?.customer; // Suporta real e simulado
  
  const email = customer?.email;
  const firstName = customer?.first_name || 'Aluno';

  // 3. Verificação de Venda Aprovada
  if (body.event === 'order.paid' && email) {
    try {
      await resend.emails.send({
        from: 'Raiz Bíblica <entrega@raizbiblica.online>',
        to: [email],
        subject: 'Seu acesso ao Raiz Bíblica chegou! 🙌',
        html: `
          <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: sans-serif; border: 1px solid #D4AF37; border-radius: 20px; text-align: center;">
            <h1 style="color: #D4AF37;">Raiz Bíblica</h1>
            <p>Olá, <strong>${firstName}</strong>!</p>
            <p>Seu acesso está liberado! Clique no botão abaixo para entrar no portal VIP.</p>
            <div style="margin: 30px 0;">
              <a href="https://area-membros-nu.vercel.app/" style="background-color: #D4AF37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">ACESSAR ÁREA DE MEMBROS</a>
            </div>
          </div>
        `
      });

      console.log(`✅ Sucesso! Entrega feita para: ${email}`);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('❌ Erro no envio:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(200).json({ message: 'Recebido', event: body.event });
}
