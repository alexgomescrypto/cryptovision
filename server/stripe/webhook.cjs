const express = require('express');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');
const bodyParser = require('body-parser');

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Conecta com Supabase
const supabase = createClient(
  process.env.YOUR_SUPABASE_URL,
  process.env.YOUR_SUPABASE_SERVICE_ROLE_KEY // precisa da chave com permissões de escrita
);

// console.log("Chave Supabase URL", process.env.YOUR_SUPABASE_URL);
// console.log("Chave Supabase Key", process.env.YOUR_SUPABASE_SERVICE_ROLE_KEY);
// console.log("Chave Stripe key", process.env.STRIPE_SECRET_KEY);

// 🚨 bodyParser precisa ser raw!
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    // 🔒 Verificação da assinatura Stripe
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Erro na verificação da assinatura:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Processar o evento após validação
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details.email;
    const plano = session.metadata?.plano || 'Desconhecido';
    const stripe_customer_id = session.customer;

    await supabase.from('assinaturas').upsert({
      email,
      stripe_customer_id,
      plano,
      status: 'ativo',
      data_inicio: new Date().toISOString()
    });

    console.log('✅ Assinatura salva no Supabase:', email, plano);
  }

  if (event.type === 'invoice.payment_failed') {
  const invoice = event.data.object;
  const stripe_customer_id = invoice.customer;

  const { data: assinatura } = await supabase
    .from('assinaturas')
    .select('*')
    .eq('stripe_customer_id', stripe_customer_id)
    .maybeSingle();

  if (assinatura) {
    await supabase
      .from('assinaturas')
      .update({ status: 'cancelado' })
      .eq('stripe_customer_id', stripe_customer_id);

    console.log('❌ Assinatura cancelada por falha de pagamento:', assinatura.email);
  }
  }
  if (event.type === 'customer.subscription.deleted') {
  const subscription = event.data.object;
  const stripe_customer_id = subscription.customer;

  const { data: assinatura } = await supabase
    .from('assinaturas')
    .select('*')
    .eq('stripe_customer_id', stripe_customer_id)
    .maybeSingle();

  if (assinatura) {
    await supabase
      .from('assinaturas')
      .update({ status: 'cancelado' })
      .eq('stripe_customer_id', stripe_customer_id);

    console.log('❌ Assinatura cancelada manualmente pelo usuário:', assinatura.email);
    }
  }

  res.sendStatus(200);
});

module.exports = router;