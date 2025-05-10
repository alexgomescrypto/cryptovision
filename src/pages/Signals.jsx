import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Signals() {
  const [sinais, setSinais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAssinatura = async () => {
      const { data: session } = await supabase.auth.getUser();
      const user = session.user;
      if (!user) return navigate('/login');

      const { data: assinatura } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('email', user.email)
        .eq('status', 'ativo')
        .maybeSingle();

      if (!assinatura) return navigate('/planos');
    };

    const carregarSinais = async () => {
      const { data, error } = await supabase
        .from('sinais')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setSinais(data);
      setCarregando(false);
    };

    verificarAssinatura().then(carregarSinais);
  }, []);

  if (carregando) return <div className="p-6 text-white">Carregando sinais...</div>;

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Sinais Ativos</h1>

        {sinais.length === 0 ? (
          <p className="text-center text-blue-200">Nenhum sinal disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sinais.map((sinal) => (
              <div key={sinal.id} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-2">{sinal.moeda}</h2>
                <p className="text-sm text-blue-200 mb-1">Entrada: <span className="text-white">{sinal.entry}</span></p>
                <p className="text-sm text-green-400 mb-1">Alvo: <span className="text-white">{sinal.target} ({sinal.target_pct}%)</span></p>
                <p className="text-sm text-red-400 mb-1">Stop: <span className="text-white">{sinal.stop} ({sinal.stop_pct}%)</span></p>
                <p className="text-sm mt-2">Status: <span className="font-semibold text-yellow-400">{sinal.status}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
