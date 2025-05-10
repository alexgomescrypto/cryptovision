import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Signals() {
  const [sinais, setSinais] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAssinatura = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return navigate('/planos');

      const { data, error } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('email', user.email)
        .eq('status', 'ativo')
        .single();

      if (!data || error) return navigate('/planos');
    };

    const buscarSinais = async () => {
      const { data, error } = await supabase
        .from('sinais')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setSinais(data);
      setLoading(false);
    };

    verificarAssinatura().then(buscarSinais);
  }, []);

  if (loading) return <div className="p-6">Carregando sinais...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Sinais Ativos</h1>
      <ul className="space-y-4">
        {sinais.map((sinal) => (
          <li key={sinal.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{sinal.moeda}</h2>
            <p>Entrada: {sinal.entry}</p>
            <p>Alvo: {sinal.target} ({sinal.target_pct}%)</p>
            <p>Stop: {sinal.stop} ({sinal.stop_pct}%)</p>
            <p>Status: {sinal.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
