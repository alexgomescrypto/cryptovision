import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Texto principal */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in">
            Sinais de Criptomoedas Profissionais com Alta Precisão
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Acesse sinais premium com taxa de acerto de até 84%. 
            Receba atualizações em tempo real, alvos claros e gerenciamento de risco.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/planos" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow transition">
              Ver Planos
            </Link>
            <Link to="/signals" className="bg-white text-blue-800 px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition">
              Acessar Sinais
            </Link>
          </div>
        </div>

        {/* Ilustração ou box adicional */}
        <div className="hidden lg:flex justify-center animate-fade-in">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Resultados Recentes</h2>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>✅ BTCUSDT: +12.3% lucro</li>
              <li>✅ ETHUSDT: +8.9% lucro</li>
              <li>✅ SOLUSDT: +6.4% lucro</li>
              <li>✅ ARBUSDT: +10.1% lucro</li>
            </ul>
            <p className="mt-4 text-sm text-blue-200">
              Resultados baseados em sinais enviados nos últimos dias.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
