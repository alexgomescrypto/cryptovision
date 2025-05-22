// Statistics.jsx - estatísticas por plano + ranking de moedas lucrativas
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,LineChart, Line } from 'recharts';
import { format } from 'date-fns';


const supabase = createClient(
  'https://tnpysphwjohiaqpyedwv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucHlzcGh3am9oaWFxcHllZHd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njc0Mjk4MSwiZXhwIjoyMDYyMzE4OTgxfQ.nNMUCothOZH3mXZc7pZoZ-p82Yc2uN4fhiNmuil7Dx0'
);

const symbolLevels = {
  'BTCUSDT': 'BASIC',
  'ETHUSDT': 'BASIC',
  'SOLUSDT': 'BASIC',
  'DOGEUSDT': 'BASIC',
  'AVAXUSDT': 'PRO',
  'BNBUSDT': 'PRO',
  'RDNTUSDT': 'PRO',
  'FXSSDT': 'PRO',
  'CFXSDT': 'PRO',
  'XRPUSDT': 'PREMIUM',
  'ADAUSDT': 'PREMIUM',
  'LINKUSDT': 'PREMIUM',
  'FARTCOINUSDT': 'PREMIUM'
};

const StatisticsPage = () => {
  const [closedSignals, setClosedSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClosed = async () => {
      const { data, error } = await supabase
        .from('sinais_trade')
        .select('*')
        .eq('signal_exit', 'CLOSE');

      if (!error) setClosedSignals(data);
      setIsLoading(false);
    };
    fetchClosed();
  }, []);

  const getLevel = (symbol) => symbolLevels[symbol] || 'PREMIUM';

  const isIncluded = {
    BASIC: (level) => level === 'BASIC',
    PRO: (level) => ['BASIC', 'PRO'].includes(level),
    PREMIUM: () => true,
  };

  const calcStats = (filterFn) => {
    const trades = closedSignals.filter(s => filterFn(getLevel(s.symbol)));
    const total = trades.length;
    const resultados = trades.map(s => Number(s.resultado || 0));
    const lucroTotal = resultados.reduce((acc, v) => acc + v, 0);
    const lucroMedio = total > 0 ? (lucroTotal / total).toFixed(2) : 0;
    const lucroMaximo = resultados.length ? Math.max(...resultados).toFixed(2) : '0.00';
    const prejuizoMaximo = resultados.length ? Math.min(...resultados).toFixed(2) : '0.00';
    const acertos = resultados.filter(v => v > 0).length;
    const taxaAcerto = total > 0 ? ((acertos / total) * 100).toFixed(1) : '0.0';
    
    return {
      total,
      lucroTotal: lucroTotal.toFixed(2),
      lucroMedio,
      lucroMaximo,
      prejuizoMaximo,
      taxaAcerto
    };
  };

  const stats = {
    BASIC: calcStats(isIncluded.BASIC),
    PRO: calcStats(isIncluded.PRO),
    PREMIUM: calcStats(isIncluded.PREMIUM),
  };

  const chartData = Object.entries(stats).map(([plano, s]) => ({
    plano,
    lucroTotal: parseFloat(s.lucroTotal),
    taxaAcerto: parseFloat(s.taxaAcerto),
    totalTrades: s.total
  }));


  <div className="mt-16">
  <h2 className="text-2xl font-bold mb-4">Desempenho por Plano</h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData}>
      <XAxis dataKey="plano" stroke="#ffffff" />
      <YAxis stroke="#ffffff" />
      <Tooltip />
      <Legend />
      <Bar dataKey="lucroTotal" fill="#34d399" name="Lucro Total (%)" />
      <Bar dataKey="taxaAcerto" fill="#facc15" name="Taxa de Acerto (%)" />
    </BarChart>
  </ResponsiveContainer>
</div>
  const COLORS = ['#34d399', '#60a5fa', '#facc15'];

  const moedasAgrupadas = {};
  
  closedSignals.forEach(signal => {
    const sym = signal.symbol;
    const lucro = Number(signal.resultado || 0);
    if (!moedasAgrupadas[sym]) moedasAgrupadas[sym] = { total: 0, lucro: 0 };
    moedasAgrupadas[sym].total += 1;
    moedasAgrupadas[sym].lucro += lucro;
  });

   const rankingMoedas = Object.entries(moedasAgrupadas)
    .map(([symbol, data]) => ({
      symbol,
      totalTrades: data.total,
      lucroTotal: data.lucro,
      mediaLucro: (data.lucro / data.total).toFixed(2)
    }))
    .sort((a, b) => b.lucroTotal - a.lucroTotal);

    

  return (
    <div className="min-h-screen bg-[#0f172a] py-32 px-6">
      <div className="max-w-6xl mx-auto text-white space-y-10">
        <h1 className="text-3xl font-bold mb-6">Estatísticas por Plano</h1>
        {isLoading ? <p>Carregando...</p> : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(stats).map(([plano, stat]) => (
                <div key={plano} className="bg-[#1e293b] p-6 rounded-xl shadow text-center space-y-1">
                  <h2 className="text-xl font-bold mb-2">Plano {plano}</h2>
                  <p>Trades: <span className="font-bold">{stat.total}</span></p>
                  <p>Lucro Total: <span className={`${stat.lucroTotal >= 0 ? 'text-green-400' : 'text-red-400'} font-bold`}>{stat.lucroTotal}%</span></p>
                  <p>Lucro Médio: <span className="text-blue-400 font-bold">{stat.lucroMedio}%</span></p>
                  <p>Maior Lucro: <span className="text-green-300 font-bold">{stat.lucroMaximo}%</span></p>
                  <p>Maior Prejuízo: <span className="text-red-400 font-bold">{stat.prejuizoMaximo}%</span></p>
                  <p>Taxa de Acerto: <span className="text-yellow-300 font-bold">{stat.taxaAcerto}%</span></p>
                </div>
              ))}
            </div>
            
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-4">Ranking de Moedas por Lucro Total</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-white bg-[#1e293b] rounded-lg">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Moeda</th>
                      <th className="p-3 text-left">Trades</th>
                      <th className="p-3 text-left">Lucro Total (%)</th>
                      <th className="p-3 text-left">Lucro Médio (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingMoedas.map((row, index) => (
                      <tr key={row.symbol} className="border-t border-slate-600">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3 font-semibold">{row.symbol}</td>
                        <td className="p-3 font-bold">{row.totalTrades}</td>
                        <td className={`p-3 font-bold ${row.lucroTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>{row.lucroTotal.toFixed(2)}%</td>
                        <td className="p-3 text-blue-400 font-bold">{row.mediaLucro}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
