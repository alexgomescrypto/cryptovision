const express = require('express');
const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { plan } = req.body;

  const prices = {
    Basic: 'price_1RLzEUC5hAPyaQqJVZhJRRrj',     // Substitua pelos IDs reais da Stripe
    Pro: 'price_1RLzEsC5hAPyaQqJSm5FI40t',
    Premium: 'price_1RLzFpC5hAPyaQqJedIO4BuO'
  };

  if (!prices[plan]) {
    return res.status(400).json({ error: 'Plano inválido' });
  }

  try {
    console.log("Criando checkout para plano:", plan, "com price_id:", prices[plan]);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: prices[plan],
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: 'http://localhost:5173/sinais',
      cancel_url: 'http://localhost:5173/planos',
      metadata: {
      plano: plan
    }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Erro ao criar sessão de checkout:", err); // <-- adicione isso
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
