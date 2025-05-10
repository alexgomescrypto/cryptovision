import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Bem-vindo ao CoinVision</h1>
      <p className="text-lg mb-6">Receba sinais de trade em tempo real e maximize seus lucros no mercado de criptomoedas.</p>
      <Link to="/planos" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Veja os Planos
      </Link>
    </div>
  );
}
