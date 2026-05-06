import fetch from 'node-fetch';

const simulateSale = async () => {
  // ATUALIZADO PARA PORTA 3005
  const url = 'http://127.0.0.1:3005/webhook/yampi';

  const dummyPayload = {
    event: 'order.paid',
    data: {
      total: 27.90,
      customer: {
        first_name: 'Marcos',
        email: 'debian.psycho@gmail.com'
      },
      items: [{ name: 'Plano Completo' }]
    }
  };

  console.log('🚀 Enviando simulação para PORTA 3005...');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dummyPayload)
    });

    const result = await response.json();
    console.log('✅ Resposta do Servidor:', result);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
};

simulateSale();
