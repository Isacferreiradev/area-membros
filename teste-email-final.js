import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  const targetEmail = 'kennerwarl@gmail.com';
  console.log(`⏳ Tentando enviar e-mail de teste para ${targetEmail}...`);
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Combine TEA <entrega@combinetea.online>', // DOMÍNIO VERIFICADO
      to: targetEmail, 
      subject: 'Teste de Entrega Oficial 🚀',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>Teste bem-sucedido!</h1>
          <p>Se você recebeu este e-mail, significa que o domínio <b>combinetea.online</b> está funcionando perfeitamente para entregas externas.</p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Erro retornado pelo Resend:', error);
    } else {
      console.log('✅ E-mail enviado com sucesso!');
      console.log('ID da operação no Resend:', data.id);
    }
  } catch (err) {
    console.error('💥 Erro inesperado:', err);
  }
}

testEmail();
