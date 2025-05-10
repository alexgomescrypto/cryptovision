import React from 'react';
import axios from 'axios';

export default function Planos() {
  const planos = [
    { nome: 'Basic', preco: 'R$29/mês', moedas: '3 moedas' },
    { nome: 'Pro', preco: 'R$59/mês', moedas: '5 moedas' },
    { nome: 'Premium', preco: 'R$99/mês', moedas: '8+ moedas' },
  ];

  const handleAssinar = async (plano) => {
    try {
      const response = await axios.post('https://cryptoapp-nhj9.onrender.com/api/create-checkout-session', { plan: plano });
      window.location.href = response.data.url; // redireciona para o Checkout da Stripe
    } catch (error) {
      alert('Erro ao iniciar pagamento: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Escolha seu Plano</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {planos.map((plano) => (
          <div key={plano.nome} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{plano.nome}</h2>
            <p className="mb-1">{plano.moedas}</p>
            <p className="mb-4">{plano.preco}</p>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => handleAssinar(plano.nome)}
            >
              Assinar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
