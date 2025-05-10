import React from 'react';

export default function Statistics() {
  const monthlyStats = {
    winRate: "78%",
    totalSignals: 245,
    avgReturn: "32%",
    bestTrade: "BTC/USDT +15.8%"
  };

  const planPerformance = [
    { plan: "Basic", returns: "384%", signals: 720, accuracy: "76%" },
    { plan: "Pro", returns: "540%", signals: 1200, accuracy: "82%" },
    { plan: "Premium", returns: "696%", signals: 1920, accuracy: "89%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white text-center mb-16">
          Performance Statistics
        </h1>

        {/* Monthly Overview */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {Object.entries(monthlyStats).map(([key, value]) => (
            <div key={key} className="bg-gray-700 rounded-xl p-6 text-center">
              <h3 className="text-gray-400 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p className="text-3xl font-bold text-blue-400">{value}</p>
            </div>
          ))}
        </div>

        {/* Plan Performance */}
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Yearly Plan Performance
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {planPerformance.map((plan) => (
            <div key={plan.plan} className="bg-gray-700 rounded-xl p-8 transform hover:scale-105 transition duration-300">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {plan.plan} Plan
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-400 mb-1">Yearly Return</p>
                  <p className="text-3xl font-bold text-green-400">{plan.returns}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 mb-1">Total Signals</p>
                  <p className="text-2xl font-bold text-blue-400">{plan.signals}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 mb-1">Signal Accuracy</p>
                  <p className="text-2xl font-bold text-yellow-400">{plan.accuracy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}