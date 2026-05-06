import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function checkStatus() {
  console.log('🔍 Iniciando Diagnóstico Profundo...\n');
  
  try {
    // 1. Testar Domínios
    const domains = await resend.domains.list();
    console.log('✅ Domínios encontrados na sua conta:');
    if (domains.data.data.length === 0) {
      console.log('❌ NENHUM domínio encontrado! Você precisa adicionar o domínio no site da Resend.');
    } else {
      domains.data.data.forEach(d => {
        console.log(`- ${d.name} (Status: ${d.status})`);
      });
    }

    // 2. Testar API Key
    console.log('\n🔑 Testando validade da API Key...');
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'aristocrata.black@gmail.com',
      subject: 'Teste de Diagnóstico',
      html: '<p>Teste</p>'
    });

    if (error) {
      console.log('❌ Erro no envio de teste:', error.message);
    } else {
      console.log('✅ API Key está funcionando! ID do envio:', data.id);
    }

  } catch (err) {
    console.log('❌ Erro crítico no diagnóstico:', err.message);
  }
}

checkStatus();
