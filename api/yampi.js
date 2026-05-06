import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const LINKS_DRIVE = {
  maps: "https://drive.google.com/drive/folders/1Kmd732P1tl2aBS-9RHDPM3Ew5YGtj4GO?usp=drive_link",
  audio: "https://drive.google.com/drive/folders/1H6k5bbhQzmqnsj26FJMXJ1mVfR3yCMUb?usp=drive_link",
  planner: "https://drive.google.com/drive/folders/1KfRVP0gpipWbKkluZC6KODaJlXWRS6wJ?usp=drive_link"
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body;
  const yampiSecret = req.headers['x-yampi-token'];

  if (process.env.YAMPI_SECRET_KEY && yampiSecret !== process.env.YAMPI_SECRET_KEY) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (body.event === 'order.paid' || body.event === 'sale.approved') {
    const customer = body.data.customer;
    const totalAmount = body.data.total;
    const isCompletePlan = totalAmount > 20;

    try {
      await resend.emails.send({
        from: 'Raiz Bíblica <entrega@combinetea.online>',
        to: [customer.email],
        subject: 'Seu acesso ao Raiz Bíblica chegou! 🙌',
        html: `
          <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #D4AF37; font-family: serif; font-size: 32px; margin-bottom: 10px;">Raiz Bíblica</h1>
              <p style="color: #888; font-size: 14px; letter-spacing: 2px;">ENTREGA DE ACESSO VIP</p>
            </div>
            
            <p style="font-size: 18px;">Olá, <strong>${customer.first_name}</strong>!</p>
            <p style="line-height: 1.6; color: #ccc;">Seus materiais estão prontos para download. Clique nos links abaixo para acessar suas pastas no Google Drive:</p>
            
            <div style="background: rgba(212, 175, 55, 0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(212, 175, 55, 0.2); margin: 30px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">Seus Links de Download:</h3>
              <p style="margin-bottom: 20px;">
                <a href="${LINKS_DRIVE.maps}" style="color: #FFF; font-weight: bold; text-decoration: none;">📂 ACESSAR OS +300 MAPAS</a>
              </p>
              <p style="margin-bottom: 20px;">
                <a href="${LINKS_DRIVE.planner}" style="color: #FFF; font-weight: bold; text-decoration: none;">📅 ACESSAR PLANNER 30 DIAS</a>
              </p>
              ${isCompletePlan ? `
              <p style="margin-bottom: 20px;">
                <a href="${LINKS_DRIVE.audio}" style="color: #FFF; font-weight: bold; text-decoration: none;">🎧 ACESSAR AUDIOGUIA VIP (BÔNUS)</a>
              </p>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://area-membros-nu.vercel.app" style="background-color: #D4AF37; color: #000; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">ENTRAR NA ÁREA DE MEMBROS</a>
              </div>
            </div>

            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 40px;">Equipe Raiz Bíblica</p>
          </div>
        `,
      });

      return res.status(200).json({ message: 'E-mail enviado' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(200).json({ message: 'Processado' });
}
