import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEmailManual() {
  const targetEmail = 'rosangelapiraja@gmail.com';
  console.log(`⏳ Enviando e-mail de acesso para ${targetEmail}...`);
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Combine TEA <entrega@combinetea.online>', 
      to: targetEmail, 
      subject: 'Seu material já está liberado! 📚✨',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f9f9f9; border-radius: 20px;">
          <div style="text-align: center; margin-bottom: 30px; font-size: 40px;">✨</div>
          <h1 style="color: #1e293b; text-align: center; font-size: 24px; margin-bottom: 10px;">Olá, Rosângela! Tudo bem?</h1>
          <p style="color: #64748b; text-align: center; font-size: 16px; line-height: 1.6;">
            Passando para avisar que o seu material já está prontinho e liberado na nossa Área de Membros exclusiva! 🎉 
          </p>
          <p style="color: #64748b; text-align: center; font-size: 16px; line-height: 1.6;">
            Preparamos tudo com muito carinho para você começar agora mesmo. Para acessar os seus materiais e bônus, basta clicar no botão abaixo:
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://area-membros-nu.vercel.app/" style="background-color: #2D8B3E; color: white; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 4px 12px rgba(45, 139, 62, 0.3);">
              ACESSAR MEUS MATERIAIS AGORA
            </a>
          </div>
          <p style="color: #64748b; text-align: center; font-size: 14px;">
            Qualquer dúvida que tiver durante o uso ou sobre as atividades, estamos à disposição.
          </p>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 40px;">
            Equipe Combine TEA<br>
            Acesso Vitalício Garantido
          </p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Erro do Resend:', error);
    } else {
      console.log('✅ E-mail enviado com sucesso para Rosângela!');
      console.log('ID do E-mail:', data.id);
    }
  } catch (err) {
    console.error('💥 Erro fatal ao enviar:', err);
  }
}

enviarEmailManual();
