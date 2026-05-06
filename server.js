import express from 'express';
import { Resend } from 'resend';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const resend = new Resend(process.env.RESEND_API_KEY);

// ÁREA DE MEMBROS OFICIAL
const PORTAL_LINK = "https://area-membros-nu.vercel.app/";

const LINKS_DRIVE = {
  maps: "https://drive.google.com/drive/folders/1Kmd732P1tl2aBS-9RHDPM3Ew5YGtj4GO?usp=drive_link",
  audio: "https://drive.google.com/drive/folders/1H6k5bbhQzmqnsj26FJMXJ1mVfR3yCMUb?usp=drive_link",
  planner: "https://drive.google.com/drive/folders/1KfRVP0gpipWbKkluZC6KODaJlXWRS6wJ?usp=drive_link"
};

app.post('/webhook/yampi', async (req, res) => {
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
            <p style="line-height: 1.6; color: #ccc;">Seja muito bem-vindo! Seu acesso à nossa Área de Membros VIP acaba de ser liberado.</p>
            
            <div style="margin: 40px 0;">
              <a href="${PORTAL_LINK}" style="background-color: #D4AF37; color: #000; padding: 20px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 18px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">ACESSAR ÁREA DE MEMBROS</a>
            </div>

            <hr style="border: 0; border-top: 1px solid rgba(212, 175, 55, 0.2); margin: 30px 0;">

            <p style="font-size: 14px; color: #888;">Caso prefira baixar os arquivos diretamente:</p>
            <div style="font-size: 13px;">
              <a href="${LINKS_DRIVE.maps}" style="color: #D4AF37; text-decoration: none;">📂 Mapas Mentais</a> | 
              <a href="${LINKS_DRIVE.planner}" style="color: #D4AF37; text-decoration: none;">📅 Planner Diário</a>
            </div>

            <p style="font-size: 12px; color: #555; margin-top: 40px;">Desejamos um excelente estudo da Palavra!<br>Equipe Raiz Bíblica</p>
          </div>
        `,
      });

      console.log(`✅ Sucesso! Aluno ${customer.email} enviado para o Portal.`);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('❌ Erro:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  res.status(200).json({ success: true });
});

app.listen(3005, () => console.log('🚀 Servidor de Entrega Oficial na 3005'));
