import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const testProduction = async () => {
  const url = 'https://area-membros-nu.vercel.app/api/yampi';
  const secret = 'wh_OSKPtHPL8P1iNAgousl1H1mvxhiTeV7qHlpY';
  const testEmail = 'aristocrata.black@gmail.com';

  console.log('🏁 INICIANDO TESTE FINAL DE PRODUÇÃO...');
  console.log(`🔗 Alvo: ${url}`);
  console.log(`📧 Destinatário: ${testEmail}\n`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-yampi-token': secret
      },
      body: JSON.stringify({
        event: 'order.paid',
        data: {
          customer: {
            first_name: 'Marcos (Teste Final)',
            email: testEmail
          }
        }
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ SUCESSO TOTAL!');
      console.log('📝 O servidor da Vercel processou e a Resend aceitou o envio.');
      console.log(`🆔 ID do E-mail: ${result.id}`);
      console.log('\n🚀 Verifique sua caixa de entrada (ou spam) em instantes!');
    } else {
      console.log('❌ FALHA NA PRODUÇÃO:');
      console.log(JSON.stringify(result, null, 2));
      console.log('\n💡 DICA: Verifique se você deu GIT PUSH e se as variáveis de ambiente na Vercel estão corretas.');
    }

  } catch (error) {
    console.log('❌ ERRO DE CONEXÃO:', error.message);
  }
};

testProduction();
