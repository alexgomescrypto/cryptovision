const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const stripeRoutes = require('./stripe/create-checkout-session.cjs');
const webhookRoutes = require('./stripe/webhook.cjs');




dotenv.config();
console.log("Chave Stripe carregada:", process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());

app.use('/api', express.json(), require('./stripe/create-checkout-session.cjs'));
app.use('/api', express.json(), require('./stripe/cancel-subscription.cjs'));
app.use('/stripe', webhookRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor Stripe rodando em http://localhost:${PORT}`);
});
