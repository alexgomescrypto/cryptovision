import React from 'react';

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white text-center mb-16">
          Suporte 24/7 via Telegram
        </h1>

        <div className="flex justify-center">
          <div className="bg-gray-700 rounded-xl p-8 text-center max-w-md transform hover:scale-105 transition duration-300">
            <h3 className="text-xl font-bold text-white mb-4">Fale com nosso suporte</h3>
            <p className="text-gray-300 mb-6">
              Entre em contato diretamente pelo Telegram com nosso especialista.
            </p>
            <a
              href="https://t.me/JhonnyCryptoVip"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Falar com @JhonnyCryptoVip
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
