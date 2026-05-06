import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const PORTAL_LINK = "https://area-membros-nu.vercel.app/";
const LINKS_DRIVE = {
  maps: "https://drive.google.com/drive/folders/1Kmd732P1tl2aBS-9RHDPM3Ew5YGtj4GO?usp=drive_link"
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body;
  const customer = body.data?.customer;

  if (body.event === 'order.paid' || body.event === 'sale.approved') {
    try {
      await resend.emails.send({
        from: 'Raiz Bíblica <entrega@raizbiblica.online>',
        to: [customer.email],
        subject: 'Seu acesso ao Raiz Bíblica chegou! 🙌',
        html: `
          <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37; border-radius: 20px; text-align: center;">
            <h1 style="color: #D4AF37; font-family: serif; font-size: 32px; margin-bottom: 20px;">Raiz Bíblica</h1>
            <p style="font-size: 18px;">Olá, <strong>${customer.first_name}</strong>!</p>
            <p style="line-height: 1.6; color: #ccc;">Seu material está liberado! Clique no botão abaixo para acessar o seu portal exclusivo.</p>
            
            <div style="margin: 40px 0;">
              <a href="${PORTAL_LINK}" style="background-color: #D4AF37; color: #000; padding: 20px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 18px;">ENTRAR NO PORTAL VIP</a>
            </div>

            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 40px;">Equipe Raiz Bíblica</p>
          </div>
        `,
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(200).json({ success: true });
}
