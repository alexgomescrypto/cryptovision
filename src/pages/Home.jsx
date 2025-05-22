import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { formatDistanceToNow } from "date-fns";
import {
  Rocket,
  BarChart3,
  ShieldCheck,
  Users,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const [stats, setStats] = useState({
    total: 0,
    lucro: 0,
    taxaAcerto: 0,
    rentabilidade: 0,
    maiorLucro: 0,
    moedaTop: "-",
    ultimoSinal: "-",
  });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("sinais_trade").select("*");

      if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
      }

      if (data && data.length > 0) {
        const total = data.length;
        const lucro = data.filter((s) => s.resultado > 0).length;
        const taxaAcerto = ((lucro / total) * 100).toFixed(1);
        const rentabilidade = data.reduce(
          (acc, s) => acc + (s.resultado || 0),
          0
        ).toFixed(2);
        const maiorLucro = Math.max(
          ...data.map((s) => s.resultado || 0)
        ).toFixed(2);

        const rentabilidadePorMoeda = {};
        data.forEach((s) => {
          if (!rentabilidadePorMoeda[s.symbol])
            rentabilidadePorMoeda[s.symbol] = 0;
          rentabilidadePorMoeda[s.symbol] += s.resultado || 0;
        });
        const moedaTop =
          Object.entries(rentabilidadePorMoeda).sort((a, b) => b[1] - a[1])[0]
            ?.[0] || "-";

        const ultimo = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )[0];
        const ultimoSinal = ultimo
          ? `${ultimo.symbol} há ${formatDistanceToNow(
              new Date(ultimo.created_at)
            )}`
          : "-";

        setStats({
          total,
          lucro,
          taxaAcerto,
          rentabilidade,
          maiorLucro,
          moedaTop,
          ultimoSinal,
        });
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero */}
      <div className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-6">Ganhe com Criptomoedas</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Receba sinais de trade em tempo real com alto índice de acerto. Lucros consistentes ao seu alcance.
        </p>
        <Link
          to="/planos"
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition duration-300"
        >
          Comece Agora
        </Link>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-16">
        <StatCard label="Total de Sinais" value={stats.total} icon={<BarChart3 />} />
        <StatCard label="Taxa de Acerto" value={`${stats.taxaAcerto}%`} icon={<ShieldCheck />} />
        <StatCard label="Rentabilidade Total" value={`${stats.rentabilidade}%`} icon={<TrendingUp />} />
        <StatCard label="Maior Lucro em Sinal" value={`${stats.maiorLucro}%`} icon={<Zap />} />
        <StatCard label="Moeda Mais Lucrativa" value={stats.moedaTop} icon={<Rocket />} />
        <StatCard label="Último Sinal" value={stats.ultimoSinal} icon={<Users />} />
      </div>

      {/* Como funciona */}
      <section className="bg-gray-800 py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-10">Como Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Step number="1" title="Receba Sinais" description="Sinais enviados em tempo real direto da nossa plataforma para você agir rápido." />
          <Step number="2" title="Execute o Trade" description="Siga as instruções de entrada, alvo e stop para cada sinal." />
          <Step number="3" title="Veja os Lucros" description="Com alta taxa de acerto, você acompanha seus ganhos acumulando." />
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Por que escolher a CoinVision?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Benefit icon={<Zap />} title="Atualização Imediata" desc="Sinais enviados em tempo real assim que ocorrem." />
          <Benefit icon={<ShieldCheck />} title="Alta Precisão" desc="Estratégias testadas e otimizadas para máxima rentabilidade." />
          <Benefit icon={<Users />} title="Suporte 24/7" desc="Nossa equipe está sempre pronta para te ajudar no caminho dos lucros." />
        </div>
      </section>

      {/* Depoimentos */}
      <section className="bg-gray-900 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">O que dizem nossos usuários</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Testimonial name="Lucas M." text="Faturei R$800 na primeira semana. Nunca mais deixo de usar a CoinVision!" />
          <Testimonial name="Amanda R." text="Plataforma incrível! Os sinais são certeiros e o suporte é excelente." />
          <Testimonial name="João P." text="Já testei várias, mas essa é a única que realmente me dá lucro." />
        </div>
      </section>

      {/* CTA Final */}
      <div className="text-center py-20 px-6 bg-gray-800">
        <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
        <p className="text-xl text-gray-300 mb-8">Assine agora e tenha acesso aos melhores sinais de trade do mercado.</p>
        <Link
          to="/planos"
          className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl text-lg font-bold transition duration-300"
        >
          Ver Planos
        </Link>
      </div>
    </div>
  );
}

// Subcomponentes
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center">
      <div className="mb-2 text-blue-500">{icon}</div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-md">
      <div className="text-4xl font-bold text-blue-500 mb-4">{number}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function Benefit({ icon, title, desc }) {
  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-md flex flex-col items-center">
      <div className="text-blue-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

function Testimonial({ name, text }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <p className="text-gray-300 mb-4">“{text}”</p>
      <p className="text-sm text-gray-500">— {name}</p>
    </div>
  );
}
