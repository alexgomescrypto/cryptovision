import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Conta() {
  const [email, setEmail] = useState('');
  const [plano, setPlano] = useState('Sem plano');
  const [stripeCustomerId, setStripeCustomerId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarUsuario = async () => {
      const { data: session } = await supabase.auth.getUser();
      const user = session.user;
      if (!user) return navigate('/login');

      setEmail(user.email);

      const { data: assinatura } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('email', user.email)
        .eq('status', 'ativo')
        .maybeSingle();

      if (assinatura) {
        setPlano(assinatura.plano);
        setStripeCustomerId(assinatura.stripe_customer_id);
      }

      setCarregando(false);
    };

    carregarUsuario();
  }, []);

  const cancelarAssinatura = async () => {
    const confirm = window.confirm('Deseja realmente cancelar sua assinatura?');
    if (!confirm) return;

    try {
      await axios.post('https://cryptoapp-nhj9.onrender.com/api/cancel-subscription', {
        stripe_customer_id: stripeCustomerId
      });
      alert('Assinatura cancelada com sucesso!');
      window.location.reload();
    } catch (err) {
      alert('Erro ao cancelar assinatura: ' + err.message);
    }
  };

  if (carregando) return <div className="p-6 text-white">Carregando conta...</div>;

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20 px-6">
      <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Minha Conta</h1>
        <p className="mb-4 text-blue-200">📧 <strong>Email:</strong> {email}</p>
        <p className="mb-6 text-blue-200">💼 <strong>Plano atual:</strong> <span className="text-white">{plano}</span></p>

        {plano !== 'Sem plano' && (
          <button
            onClick={cancelarAssinatura}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
          >
            Cancelar Assinatura
          </button>
        )}
      </div>
    </section>
  );
}
