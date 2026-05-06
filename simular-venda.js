const fetch = require('node-fetch');

// SIMULADOR DE VENDA APROVADA NA YAMPI
const simulateSale = async () => {
  const url = 'http://localhost:3001/webhook/yampi';
  
  const dummyPayload = {
    event: 'order.paid',
    data: {
      total: 27.90, // Simulando Plano Completo
      customer: {
        first_name: 'Marcos',
        email: 'seu_email_de_teste@gmail.com' // TROQUE PELO SEU E-MAIL PARA TESTAR
      },
      items: [
        { name: 'Raiz Bíblica - Plano Completo', quantity: 1 }
      ]
    }
  };

  console.log('🚀 Enviando simulação de venda para o servidor...');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dummyPayload)
    });

    const result = await response.json();
    console.log('✅ Resposta do Servidor:', result);
  } catch (error) {
    console.error('❌ Erro na simulação:', error.message);
    console.log('\n💡 Dica: Certifique-se de que o servidor (node server.js) está rodando!');
  }
};

simulateSale();
