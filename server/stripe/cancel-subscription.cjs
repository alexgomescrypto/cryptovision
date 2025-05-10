// cancel-subscription.cjs
const express = require('express');
const Stripe = require('stripe');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/cancel-subscription', async (req, res) => {
  const { stripe_customer_id } = req.body;

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripe_customer_id,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return res.status(400).json({ error: 'Nenhuma assinatura ativa encontrada.' });
    }

    const subscriptionId = subscriptions.data[0].id;

    await stripe.subscriptions.cancel(subscriptionId);
    res.json({ message: 'Assinatura cancelada com sucesso.' });
  } catch (err) {
    console.error('Erro ao cancelar assinatura:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
