import express from 'express';
import { Resend } from 'resend';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/webhook/yampi', async (req, res) => {
  const body = req.body;
  const yampiSecret = req.headers['x-yampi-token'];
  const localSecret = process.env.YAMPI_SECRET_KEY;

  if (localSecret && yampiSecret !== localSecret) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Padrão Real Yampi
  const customer = body.resource?.customer?.data || body.data?.customer;
  const email = customer?.email;

  if (body.event === 'order.paid' && email) {
    try {
      await resend.emails.send({
        from: 'Raiz Bíblica <entrega@raizbiblica.online>',
        to: [email],
        subject: 'Seu acesso ao Raiz Bíblica chegou! 🙌',
        html: `<h1>Raiz Bíblica</h1><p>Olá, ${customer?.first_name}! Acesso liberado no portal.</p>`
      });
      
      console.log(`✅ E-mail enviado (Padrão Yampi) para: ${email}`);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.status(200).json({ success: true, message: 'Recebido' });
});

app.listen(3005, () => console.log('🚀 Servidor Local (Padrão Oficial Yampi) na 3005'));
