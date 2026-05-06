import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const body = req.body;
  const yampiSecret = req.headers['x-yampi-token'];
  const localSecret = process.env.YAMPI_SECRET_KEY;

  // 1. Segurança
  if (localSecret && yampiSecret !== localSecret) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  // 2. Extração Blindada (Lê o padrão real da Yampi e o padrão de teste)
  const resource = body.resource;
  const customer = resource?.customer?.data || body.data?.customer;
  
  const email = customer?.email || body.email;
  const firstName = customer?.first_name || 'Aluno';

  // 3. Só envia se for evento de aprovação (order.paid) ou se for um teste manual
  const isPaid = body.event === 'order.paid' || body.event === 'sale.approved' || !body.event;

  if (isPaid && email) {
    try {
      await resend.emails.send({
        from: 'Raiz Bíblica <entrega@raizbiblica.online>',
        to: [email],
        subject: 'Seu acesso ao Raiz Bíblica chegou! 🙌',
        html: `
          <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: sans-serif; border: 1px solid #D4AF37; border-radius: 20px; text-align: center;">
            <h1 style="color: #D4AF37; font-family: serif; font-size: 32px; margin-bottom: 20px;">Raiz Bíblica</h1>
            <p style="font-size: 18px;">Olá, <strong>${firstName}</strong>!</p>
            <p style="line-height: 1.6; color: #ccc;">Seu material já está liberado. Clique no botão abaixo para entrar no seu portal VIP.</p>
            <div style="margin: 40px 0;">
              <a href="https://area-membros-nu.vercel.app/" style="background-color: #D4AF37; color: #000; padding: 18px 35px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">ENTRAR NO PORTAL VIP</a>
            </div>
            <p style="font-size: 12px; color: #666; margin-top: 40px;">Equipe Raiz Bíblica</p>
          </div>
        `
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(200).json({ message: 'Recebido', event: body.event });
}
