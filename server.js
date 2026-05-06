import express from 'express';
import { Resend } from 'resend';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const resend = new Resend(process.env.RESEND_API_KEY);

const LINKS_DRIVE = {
  maps: "https://drive.google.com/drive/folders/1Kmd732P1tl2aBS-9RHDPM3Ew5YGtj4GO?usp=drive_link",
  audio: "https://drive.google.com/drive/folders/1H6k5bbhQzmqnsj26FJMXJ1mVfR3yCMUb?usp=drive_link",
  planner: "https://drive.google.com/drive/folders/1KfRVP0gpipWbKkluZC6KODaJlXWRS6wJ?usp=drive_link"
};

app.post('/webhook/yampi', async (req, res) => {
  const body = req.body;
  const yampiSecret = req.headers['x-yampi-token'];

  if (process.env.YAMPI_SECRET_KEY && yampiSecret !== process.env.YAMPI_SECRET_KEY) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (body.event === 'order.paid' || body.event === 'sale.approved') {
    const customer = body.data.customer;

    try {
      // ATUALIZADO PARA O DOMÍNIO OFICIAL: raizbiblica.online
      await resend.emails.send({
        from: 'Raiz Bíblica <entrega@raizbiblica.online>', 
        to: [customer.email],
        subject: 'Seu acesso ao Raiz Bíblica chegou! 🙌',
        html: `
          <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #D4AF37; font-family: serif; font-size: 32px; margin-bottom: 10px;">Raiz Bíblica</h1>
              <p style="color: #888; font-size: 14px; letter-spacing: 2px;">ENTREGA DE ACESSO VIP</p>
            </div>
            
            <p style="font-size: 18px;">Olá, <strong>${customer.first_name}</strong>!</p>
            <p style="line-height: 1.6; color: #ccc;">Seus materiais já estão liberados. Clique no botão abaixo para acessar sua pasta exclusiva no Google Drive.</p>
            
            <div style="background: rgba(212, 175, 55, 0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(212, 175, 55, 0.2); margin: 30px 0; text-align: center;">
              <a href="${LINKS_DRIVE.maps}" style="background-color: #D4AF37; color: #000; padding: 18px 35px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 16px;">ACESSAR MEUS MATERIAIS</a>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <p style="font-size: 14px; color: #666;">Dúvidas? Acesse nosso portal:<br>
              <a href="https://area-membros-nu.vercel.app" style="color: #D4AF37;">area-membros-nu.vercel.app</a></p>
            </div>
          </div>
        `,
      });

      console.log(`✅ Sucesso! E-mail enviado de entrega@raizbiblica.online para: ${customer.email}`);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('❌ Erro no envio:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.status(200).json({ success: true });
});

const PORT = 3005;
app.listen(PORT, () => console.log(`🚀 Servidor de Entrega rodando na porta ${PORT}`));
