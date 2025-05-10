import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Statistics() {
  const [estatisticas, setEstatisticas] = useState({ total: 0, ganhos: 0, perdas: 0, percentual: 0 });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const calcularEstatisticas = async () => {
      const { data: sinais } = await supabase.from('sinais').select('*');
      if (!sinais) return;

      const total = sinais.length;
      const ganhos = sinais.filter((s) => s.status?.toLowerCase() === 'ganho').length;
      const perdas = sinais.filter((s) => s.status?.toLowerCase() === 'perda').length;
      const percentual = total > 0 ? ((ganhos / total) * 100).toFixed(1) : 0;

      setEstatisticas({ total, ganhos, perdas, percentual });
      setCarregando(false);
    };

    calcularEstatisticas();
  }, []);

  if (carregando) return <div className="p-6 text-white">Carregando estatísticas...</div>;

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Estatísticas de Performance</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold">Total de Sinais</h2>
            <p className="text-3xl font-bold mt-2">{estatisticas.total}</p>
          </div>

          <div className="bg-green-700 p-6 rounded-xl border border-green-500">
            <h2 className="text-xl font-semibold">Sinais com Ganho</h2>
            <p className="text-3xl font-bold mt-2">{estatisticas.ganhos}</p>
          </div>

          <div className="bg-red-700 p-6 rounded-xl border border-red-500">
            <h2 className="text-xl font-semibold">Sinais com Perda</h2>
            <p className="text-3xl font-bold mt-2">{estatisticas.perdas}</p>
          </div>
        </div>

        <p className="mt-10 text-lg text-blue-200">
          Taxa de acerto: <span className="text-white font-bold">{estatisticas.percentual}%</span>
        </p>
      </div>
    </section>
  );
}
