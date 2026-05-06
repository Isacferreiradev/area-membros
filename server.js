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

  const customer = body.data?.customer;
  const email = customer?.email || body.email;

  if (body.event === 'order.paid' || body.event === 'sale.approved' || !body.event) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'Raiz Bíblica <entrega@raizbiblica.online>',
        to: [email],
        subject: 'Seu acesso ao Raiz Bíblica chegou! 🙌',
        html: `<h1>Raiz Bíblica</h1><p>Olá, ${customer?.first_name || 'Aluno'}! Seu acesso está liberado.</p>`
      });

      if (error) return res.status(400).json({ error });
      
      console.log(`✅ E-mail enviado localmente para: ${email}`);
      return res.status(200).json({ success: true, id: data.id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.status(200).json({ success: true });
});

const PORT = 3005;
app.listen(PORT, () => console.log(`🚀 Servidor Local rodando na porta ${PORT}`));
