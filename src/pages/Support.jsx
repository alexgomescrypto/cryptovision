import React from 'react';

export default function Support() {
  const supportChannels = [
    {
      title: "WhatsApp Support",
      description: "Get instant help from our support team",
      action: "Chat Now",
      link: "https://wa.me/seunumerosuporte"
    },
    {
      title: "Email Support",
      description: "Send us your questions or concerns",
      action: "Send Email",
      link: "mailto:support@coinvision.com"
    },
    {
      title: "FAQ",
      description: "Find answers to common questions",
      action: "Read More",
      link: "#faq"
    }
  ];

  const faqs = [
    {
      question: "How do I get started with CoinVision?",
      answer: "Simply sign up for an account, choose your preferred plan, and start receiving trading signals immediately after your subscription is confirmed."
    },
    {
      question: "How often are signals sent?",
      answer: "Signals are sent in real-time as trading opportunities arise. The number of signals varies based on your subscription plan and market conditions."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time from your account dashboard. The service will remain active until the end of your billing period."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white text-center mb-16">
          24/7 Support
        </h1>

        {/* Support Channels */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {supportChannels.map((channel) => (
            <div key={channel.title} className="bg-gray-700 rounded-xl p-8 text-center transform hover:scale-105 transition duration-300">
              <h3 className="text-xl font-bold text-white mb-4">{channel.title}</h3>
              <p className="text-gray-300 mb-6">{channel.description}</p>
              <a
                href={channel.link}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                {channel.action}
              </a>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}