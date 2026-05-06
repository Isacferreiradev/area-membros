const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
require('dotenv').config();

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
      await resend.emails.send({
        from: 'Raiz Bíblica <entrega@combinetea.online>',
        to: [customer.email],
        subject: 'Seu acesso ao Raiz Bíblica chegou! 🙌',
        html: `
          <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37;">
            <h1 style="color: #D4AF37; text-align: center;">Raiz Bíblica</h1>
            <p>Olá, ${customer.first_name}!</p>
            <p>Acesse seus materiais nos links abaixo:</p>
            <p><a href="${LINKS_DRIVE.maps}" style="color: #D4AF37;">📂 MAPAS BÍBLICOS</a></p>
            <p><a href="${LINKS_DRIVE.planner}" style="color: #D4AF37;">📅 PLANNER 30 DIAS</a></p>
            <p><a href="${LINKS_DRIVE.audio}" style="color: #D4AF37;">🎧 AUDIOGUIA VIP</a></p>
          </div>
        `,
      });

      return res.status(200).json({ message: 'E-mail enviado' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(200).json({ message: 'Recebido' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Rodando na porta ${PORT}`));
