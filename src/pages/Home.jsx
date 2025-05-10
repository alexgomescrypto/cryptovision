import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const stats = {
    basic: { monthly: "32%", yearly: "384%" },
    pro: { monthly: "45%", yearly: "540%" },
    premium: { monthly: "58%", yearly: "696%" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-8">
          Trade Smarter with CoinVision
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Get real-time crypto trading signals powered by advanced algorithms and expert analysis
        </p>
        <Link
          to="/planos"
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Start Trading Now
        </Link>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Performance Statistics
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(stats).map(([plan, performance]) => (
              <div key={plan} className="bg-gray-700 rounded-xl p-8 text-center transform hover:scale-105 transition duration-300">
                <h3 className="text-2xl font-bold text-white capitalize mb-6">{plan} Plan</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 mb-2">Monthly Average Return</p>
                    <p className="text-4xl font-bold text-green-400">{performance.monthly}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-2">Yearly Projection</p>
                    <p className="text-4xl font-bold text-green-400">{performance.yearly}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Why Choose CoinVision?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-700 p-8 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Real-Time Signals</h3>
            <p className="text-gray-300">
              Get instant notifications for trading opportunities across multiple cryptocurrencies
            </p>
          </div>
          <div className="bg-gray-700 p-8 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Expert Analysis</h3>
            <p className="text-gray-300">
              Signals based on comprehensive technical and fundamental analysis
            </p>
          </div>
          <div className="bg-gray-700 p-8 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">24/7 Support</h3>
            <p className="text-gray-300">
              Get help whenever you need it with our dedicated support team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}