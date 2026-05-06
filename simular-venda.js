import fetch from 'node-fetch';

const simulateRealYampi = async () => {
  const url = 'http://127.0.0.1:3005/webhook/yampi';
  
  // PAYLOAD EXATO DA DOCUMENTAÇÃO DA YAMPI
  const dummyPayload = {
    event: 'order.paid',
    resource: {
      customer: {
        data: {
          first_name: 'Marcos (Teste Real)',
          email: 'aristocrata.black@gmail.com'
        }
      }
    }
  };

  console.log('🚀 Enviando simulação no padrão REAL da Yampi...');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-yampi-token': 'wh_OSKPtHPL8P1iNAgousl1H1mvxhiTeV7qHlpY'
      },
      body: JSON.stringify(dummyPayload)
    });

    const result = await response.json();
    console.log('✅ Resposta do Servidor:', result);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
};

simulateRealYampi();
