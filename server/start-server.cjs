const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const { sendToTelegram, sendToSecondTelegram } = require('./utils/telegram.cjs');
require('dotenv').config();

// console.log("Chave Stripe carregada:", process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.YOUR_SUPABASE_URL,
  process.env.YOUR_SUPABASE_SERVICE_ROLE_KEY
);

const app = express();
app.use('/stripe', require('./stripe/webhook.cjs'));
app.use(cors());

app.use(express.json());
app.use('/api', require('./stripe/create-checkout-session.cjs'));
app.use('/api', require('./stripe/cancel-subscription.cjs'));


// Webhook do TradingView
app.post('/webhook-sinal', async (req, res) => {
  const { msg, signal, price, symbol, pass } = req.body;

  if (pass !== 'Coinvision1234#') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

 // ✅ Se for apenas uma mensagem de teste simples
  if (msg && !signal && !price && !symbol) {
    console.log("🧪 Mensagem de teste recebida:", msg);
    return res.status(200).json({ status: 'mensagem de teste recebida' });
  }

  // Encaminhar para segundo webhook
try {
  await axios.post('https://cripto-vision-server-dev.onrender.com/api/signals/post-signals', {
    msg,
    signal,
    price,
    symbol,
    pass
  });
  console.log("➡️ Sinal encaminhado ao segundo webhook com sucesso");
  console.log("📤 Enviando para segundo webhook:", {
  msg,
  signal,
  price,
  symbol,
  pass
});
} catch (err) {
  console.error("❌ Erro ao encaminhar para o segundo webhook:", err.response?.data || err.message);
}

  const now = new Date().toISOString();
  let signalObj = {
    msg,
    symbol,
    created_at: now,
    updated_at: now,
    entry_price: null,
    exit_price: null,
    signal_entry: null,
    signal_exit: null,
    take_profit: null,
    stop_loss: null,
    breakeven: null
  };

  // Sinal de entrada
 if (typeof signal === 'string') {
  const action = signal.split(',')[0].trim().toUpperCase();
  if (action === 'BUY' || action === 'SELL') {
    const [entry, alvo, stop] = signal.split(',').map(s => s.trim());
    signalObj.signal_entry = entry;
    signalObj.entry_price = price;
    signalObj.take_profit = alvo?.split(':')[1] || null;
    signalObj.stop_loss = stop?.split(':')[1] || null;

    const messageId = await sendToTelegram(signalObj);
    await sendToSecondTelegram({ symbol });
    console.log("📨 messageId:", messageId);
    signalObj.telegram_message_id = messageId;

    console.log("📨 Dados que serão salvos:", signalObj);
    await supabase.from('sinais_trade').insert([signalObj]);

  } else if (signal.includes('BREAKEVEN')) {
    signalObj.breakeven = 'BREAKEVEN';

    const { data: existing } = await supabase
      .from('sinais_trade')
      .select('id, telegram_message_id')
      .eq('symbol', symbol)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

        // Preenche signalObj com dados do sinal original para exibir entrada e datas
    await supabase.from('sinais_trade')
      .update({ breakeven: 'BREAKEVEN' })
      .eq('id', existing?.id);

        // Preenche os dados para exibir corretamente no Telegram
      signalObj.telegram_message_id = existing.telegram_message_id;

      // Envia a mensagem de BREAKEVEN para o Telegram
      await sendToTelegram(signalObj, existing.telegram_message_id);
      await sendToSecondTelegram({ symbol });

  } else if (signal.trim().toUpperCase().includes('CLOSE')) {
  signalObj.signal_exit = 'CLOSE';
  signalObj.exit_price = price;

  const { data: existing, error } = await supabase
    .from('sinais_trade')
    .select('id, telegram_message_id, entry_price, signal_entry, created_at')
    .eq('symbol', symbol)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    signalObj.entry_price = existing.entry_price;
    signalObj.signal_entry = existing.signal_entry;
    signalObj.created_at = existing.created_at;
    signalObj.updated_at = now;

    const entry = parseFloat(existing.entry_price);
    const exit = parseFloat(price);
    const isBuy = existing.signal_entry === 'BUY';
    const profit = entry && exit ? (((isBuy ? exit - entry : entry - exit) / entry) * 100).toFixed(2) : null;

    const messageId = await sendToTelegram(signalObj, existing.telegram_message_id);
    await sendToSecondTelegram({ symbol });

    const { error: updateError } = await supabase.from('sinais_trade')
      .update({
        signal_exit: 'CLOSE',
        exit_price: price,
        updated_at: now,
        resultado: profit !== null ? parseFloat(profit) : null
      })
      .eq('id', existing.id);

    if (updateError) {
      console.error("❌ Erro ao atualizar sinal com resultado:", updateError);
    } else {
      console.log(`✅ Resultado ${profit}% salvo com sucesso no sinal ${existing.id}`);
    }
  } else {
    console.log('❌ Sinal original não encontrado no banco de dados para o símbolo:', symbol);
  }
}}

  res.status(200).json({ status: 'success' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});