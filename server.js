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

  // Extração Blindada
  const resource = body.resource;
  const customer = resource?.customer?.data || body.data?.customer;
  const email = customer?.email || body.email;

  if ((body.event === 'order.paid' || !body.event) && email) {
    try {
      await resend.emails.send({
        from: 'Raiz Bíblica <entrega@raizbiblica.online>',
        to: [email],
        subject: 'Seu acesso ao Raiz Bíblica chegou! 🙌',
        html: `<h1>Raiz Bíblica</h1><p>Olá, ${customer?.first_name || 'Aluno'}! Acesso liberado no portal.</p>`
      });
      
      console.log(`✅ E-mail enviado para: ${email}`);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.status(200).json({ success: true });
});

const PORT = 3005;
app.listen(PORT, () => console.log(`🚀 Servidor Local REATIVADO na 3005`));
