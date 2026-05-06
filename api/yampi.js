import { Resend } from 'resend';

// Inicialização segura
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // 1. Logs de entrada para o painel da Vercel
  console.log('--- REQUISIÇÃO RECEBIDA NA VERCEL ---');
  
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const body = req.body;
  const yampiSecret = req.headers['x-yampi-token'];
  const localSecret = process.env.YAMPI_SECRET_KEY;

  // 2. Validação de Segurança
  if (localSecret && yampiSecret !== localSecret) {
    console.error('❌ Token Inválido');
    return res.status(401).json({ error: 'Token de segurança inválido' });
  }

  // 3. Extração de dados (Suporta simulação e Yampi real)
  const customer = body.data?.customer;
  const email = customer?.email || body.email; // Flexível para testes
  const name = customer?.first_name || 'Aluno';

  if (!email) {
    return res.status(400).json({ error: 'E-mail do cliente não encontrado' });
  }

  try {
    console.log(`📧 Enviando material para: ${email}`);
    
    const { data, error } = await resend.emails.send({
      from: 'Raiz Bíblica <entrega@raizbiblica.online>',
      to: [email],
      subject: 'Seu acesso ao Raiz Bíblica chegou! 🙌',
      html: `
        <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: sans-serif; border: 1px solid #D4AF37; border-radius: 20px; text-align: center;">
          <h1 style="color: #D4AF37;">Raiz Bíblica</h1>
          <p>Olá, <strong>${name}</strong>!</p>
          <p>Seu acesso está liberado no portal:</p>
          <div style="margin: 30px 0;">
            <a href="https://area-membros-nu.vercel.app/" style="background-color: #D4AF37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">ENTRAR NO PORTAL VIP</a>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Erro Resend:', error);
      return res.status(400).json({ success: false, error });
    }

    console.log('✅ E-mail enviado com sucesso!');
    return res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    console.error('❌ Erro Crítico:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
