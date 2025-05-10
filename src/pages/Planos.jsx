import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const plans = [
  {
    id: 'Basic',
    name: 'Basic',
    price: 'R$29/mês',
    features: ['3 sinais por dia', 'Atualização em tempo real', 'Suporte via email'],
    recommended: false
  },
  {
    id: 'Pro',
    name: 'Pro',
    price: 'R$59/mês',
    features: ['5 sinais por dia', 'Alertas prioritários', 'Suporte rápido 24h'],
    recommended: true
  },
  {
    id: 'Premium',
    name: 'Premium',
    price: 'R$99/mês',
    features: ['8+ sinais por dia', 'Atualização instantânea', 'Suporte VIP'],
    recommended: false
  }
];

export default function Plans() {
  const navigate = useNavigate();

  const handleAssinar = async (planId) => {
    const session = await supabase.auth.getSession();
    const user = session?.data?.session?.user;

    if (!user) {
      alert('Você precisa estar logado para assinar um plano.');
      return navigate('/login');
    }

    try {
      const response = await axios.post('https://cryptoapp-nhj9.onrender.com/api/create-checkout-session', {
        plan: planId
      });
      window.location.href = response.data.url;
    } catch (error) {
      alert('Erro ao redirecionar para o pagamento: ' + error.message);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="bg-blue-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Escolha seu Plano</h1>
        <p className="text-lg text-blue-100">Assine para receber os melhores sinais de trade em tempo real</p>
      </section>

      {/* Planos */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-xl p-6 shadow bg-gray-800 text-white relative ${
                plan.recommended ? 'border-green-500 scale-105' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl">
                  Popular
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <p className="text-lg mb-4">{plan.price}</p>

              <ul className="mb-6 space-y-2 text-sm text-blue-100">
                {plan.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>

              <button
                onClick={() => handleAssinar(plan.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              >
                Assinar {plan.name}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
