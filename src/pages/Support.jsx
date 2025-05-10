import React from 'react';

export default function Support() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Central de Suporte</h1>
        <p className="text-blue-200 mb-10 text-center">
          Precisa de ajuda? Entre em contato conosco pelos canais abaixo ou envie uma mensagem.
        </p>

        <div className="bg-gray-800 p-6 rounded-xl shadow border border-gray-700 mb-10">
          <h2 className="text-xl font-semibold mb-4">Canais de Suporte</h2>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li>📧 Email: suporte@coinvision.com</li>
            <li>📱 WhatsApp: +55 11 91234-5678</li>
            <li>📣 Telegram: @coinvision_suporte</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Enviar Mensagem</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Seu nome" className="w-full p-3 rounded bg-gray-700 text-white" />
            <input type="email" placeholder="Seu email" className="w-full p-3 rounded bg-gray-700 text-white" />
            <textarea rows="5" placeholder="Sua mensagem..." className="w-full p-3 rounded bg-gray-700 text-white" />
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded transition">
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
