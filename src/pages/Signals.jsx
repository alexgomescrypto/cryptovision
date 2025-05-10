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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20">
        <div className="container mx-auto px-6 text-center text-white">
          <div className="animate-pulse">Loading signals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Active Signals</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sinais.map((sinal) => (
            <div 
              key={sinal.id} 
              className="bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{sinal.moeda}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  sinal.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  sinal.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {sinal.status}
                </span>
              </div>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Entry:</span>
                  <span className="font-semibold text-white">{sinal.entry}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span className="font-semibold text-green-400">
                    {sinal.target} ({sinal.target_pct}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Stop:</span>
                  <span className="font-semibold text-red-400">
                    {sinal.stop} ({sinal.stop_pct}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}