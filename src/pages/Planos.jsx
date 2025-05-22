import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function Planos() {
  const navigate = useNavigate();

  const planos = [
    {
      id: 'Basic',
      nome: 'Basic',
      preco: 'R$29/mês',
      moedas: '3 moedas',
      features: [
        'Atualizações em tempo real com prioridade',
        'Alertas prioritários',
        '3 criptomoedas premium'
      ]
    },
    {
      id: 'Pro',
      nome: 'Pro',
      preco: 'R$59/mês',
      moedas: '5 moedas',
      features: [
        'Atualizações em tempo real com prioridade',
        'Alertas prioritários',
        '5 criptomoedas premium'
      ]
    },
    {
      id: 'Premium',
      nome: 'Premium',
      preco: 'R$99/mês',
      moedas: '8+ moedas',
      features: [
        'Atualizações em tempo real com prioridade',
        'Alertas prioritários',
        '8+ criptomoedas premium'
      ]
    },
  ];

  const faqs = [
    {
      question: 'Qual a precisão dos sinais de trade?',
      answer:
        'Nossos sinais têm taxa de acerto documentada entre 75% e 85%, com base no desempenho histórico. No entanto, nenhum serviço pode garantir lucros, pois o mercado de criptomoedas é volátil.'
    },
    {
      question: 'Posso cancelar minha assinatura a qualquer momento?',
      answer:
        'Sim, você pode cancelar a assinatura quando quiser. O acesso continua disponível até o fim do período vigente.'
    },
    {
      question: 'Como os sinais são entregues?',
      answer:
        'Os sinais são enviados em tempo real via WebSocket. Dependendo do seu plano, você também recebe notificações por e-mail e/ou SMS.'
    },
    {
      question: 'Vocês oferecem política de reembolso?',
      answer:
        'Sim, oferecemos garantia de 7 dias. Caso não fique satisfeito, entre em contato com nosso suporte dentro desse prazo para reembolso.'
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAssinar = async (plano) => {
    const session = await supabase.auth.getSession();
    const user = session?.data?.session?.user;
    if (!user) {
      alert('Você precisa estar logado para assinar um plano.');
      return navigate('/login');
    }

    try {
      const response = await axios.post('https://cryptoapp-nhj9.onrender.com/api/create-checkout-session', { plan: plano, email: user.email, });
      // const response = await axios.post('http://localhost:3000/api/create-checkout-session', { plan: plano, email: user.email, });
      window.location.href = response.data.url;
    } catch (error) {
      alert('Erro ao iniciar pagamento: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-16">Escolha seu plano de trade</h1>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {planos.map((plano) => (
            <div
              key={plano.nome}
              className="bg-gray-700 rounded-xl p-8 transform hover:scale-105 transition duration-300"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">{plano.nome}</h2>
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
                Comece agora
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="text-blue-400 w-5 h-5" />
                    <h3 className="text-lg font-semibold text-blue-300">{faq.question}</h3>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                {openIndex === index && (
                  <p className="text-gray-300 mt-4 text-sm transition-opacity">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
