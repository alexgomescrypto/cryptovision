import React from 'react';
import axios from 'axios';

export default function Planos() {
  const planos = [
    {
      id: 'Basic',
      nome: 'Basic',
      preco: 'R$29/mês',
      moedas: '3 moedas',
      features: [
        'Priority real-time updates',
        'Priority alerts',
        '24/7 support',
        '3 Premium Cryptocurrencies'
      ]
    },
    {
      id: 'Pro',
      nome: 'Pro',
      preco: 'R$59/mês',
      moedas: '5 moedas',
      features: [
        'Priority real-time updates',
        'Priority alerts',
        '24/7 support',
        '5 Premium Cryptocurrencies',
        'Advanced Technical Analysis'
      ]
    },
    {
      id: 'Premium',
      nome: 'Premium',
      preco: 'R$99/mês',
      moedas: '8+ moedas',
      features: [
        'Priority real-time updates',
        'Priority alerts',
        '24/7 support',
        '8+ Premium Cryptocurrencies',
        'Advanced Technical Analysis',
        'Custom Alert Settings'
      ]
    },
  ];

  const handleAssinar = async (planId) => {
    

    if (!user) {
      alert('Você precisa estar logado para assinar um plano.');
      return navigate('/login');
    }
    
    try {
      const response = await axios.post('https://cryptoapp-nhj9.onrender.com/api/create-checkout-session', { plan: planId });
      window.location.href = response.data.url;
    } catch (error) {
      alert('Erro ao iniciar pagamento: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white text-center mb-16">Choose Your Trading Plan</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {planos.map((plano) => (
            <div key={plano.nome} className="bg-gray-700 rounded-xl p-8 transform hover:scale-105 transition duration-300">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">{plano.nome}</h2>
                <p className="text-3xl font-bold text-blue-400 mb-2">{plano.preco}</p>
                <p className="text-gray-400">{plano.moedas}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plano.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                onClick={() => handleAssinar(plano.nome)}
              >
                Start Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}