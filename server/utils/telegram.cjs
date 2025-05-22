// utils/telegram.js (versão CommonJS para Node.js backend)
const axios = require('axios');

const TELEGRAM_TOKEN = '8096090609:AAHQ8j_dvQwJNzbgOmlAjCEQQhrlobwfmMY';
const TELEGRAM_CHAT_ID = '-1002680445409';

const TELEGRAM_TOKEN_2 = '8187742686:AAF4kmmmw8XB_kF-dxDSs-UPpeBflebiZu0';
const TELEGRAM_CHAT_ID_2 = '-1002667496971';



const sendToTelegram = async (signal, replyToMessageId = null) => {
  let title = '';
  let message = '';

  const entry = parseFloat(signal.entry_price);
  const tp = parseFloat(signal.take_profit);
  const sl = parseFloat(signal.stop_loss);

  const isBuy = signal.signal_entry === 'BUY';

    // Cálculo das porcentagens
  const percTp = entry && tp ? (((isBuy ? tp - entry : tp - entry) / entry) * 100).toFixed(1) : null;
  const percSl = entry && sl ? (((isBuy ? sl - entry : sl - entry) / entry) * 100).toFixed(1) : null;

  // Cálculo de leverage
  let leverage = '5x';
  if (percSl !== null) {
    const slValue = parseFloat(percSl);
    if (slValue <= 5) {
      leverage = '20x';
    } else if (slValue <= 10) {
      leverage = '10x';
      } else if (slValue <= 20) {
      leverage = '5x';
    }
  }

  const formatPrice = (price) => {
  if (!price || isNaN(price)) return '-';
  price = parseFloat(price);
  if (price >= 1) return price.toFixed(2);

  const digits = price.toExponential(6).match(/e-(\d+)/);
  const precision = digits ? parseInt(digits[1]) + 2 : 4;
  return price.toFixed(precision);
  };

 const emojiEntry = signal.signal_entry === 'BUY' ? '🟢' : '🛑';

  // Formatação do símbolo
  const formattedSymbol = `#${signal.symbol}`;

  // Formatar mensagem de abertura
  if ((signal.signal_entry === 'BUY' || signal.signal_entry === 'SELL') && !signal.signal_exit) {
    title = `⚡️⚡️ ${formattedSymbol} ⚡️⚡️`;
    message = 
`${title}
Exchanges: MEXC 👉 [Registration](https://promote.mexc.com/r/FweTwK01) 

Signal Type: ${emojiEntry}${signal.signal_entry}

Leverage: Isolated (${leverage}) or Cross 20X

🟢 Entry: $${formatPrice(entry)}

🎯 Take-Profit: $${formatPrice(tp)} ${percTp ? `(${percTp}%)` : ''}

🛑 Stop-Loss: $${formatPrice(sl)} ${percSl ? `(${percSl}%)` : ''}`;
  }

  // Mensagem de BREAKEVEN
  else if (signal.breakeven === 'BREAKEVEN') {
    title = '🟡 *Mova Stop para BREAKEVEN*';
    message = `${title}\n🪙 *${signal.symbol}*\n📝 ${signal.breakeven}`;
  }

  // Mensagem de CLOSE
  else if (signal.signal_exit === 'CLOSE') {
  const isBuy = signal.signal_entry === 'BUY';
  const entry = parseFloat(signal.entry_price);
  const exit = parseFloat(signal.exit_price);
  const profit = entry && exit ? (((isBuy ? exit - entry : entry - exit) / entry) * 100).toFixed(2) : null;
  const isProfit = profit !== null && parseFloat(profit) >= 0;

  const emojiStart = isProfit ? '✅ TARGET' : '❌ STOP-LOSS';
  const emojiEnd = isProfit ? '✅' : '🛑';
  const percentStr = profit !== null ? `(${isProfit ? '+' : ''}${profit}%)` : '';

  // Calcular duração
  const createdAt = signal.created_at ? new Date(signal.created_at) : null;
  const closedAt = signal.updated_at ? new Date(signal.updated_at) : null;
  
  if (!isNaN(createdAt) && !isNaN(closedAt)) {
  const durationMs = closedAt - createdAt;
  const minutes = Math.floor(durationMs / 60000) % 60;
  const hours = Math.floor(durationMs / 3600000) % 24;
  const days = Math.floor(durationMs / 86400000);

  let durationStr = '⏱ Duração: ';
  if (days > 0) durationStr += `${days}d `;
  if (hours > 0) durationStr += `${hours}h `;
  if (minutes > 0 || (days === 0 && hours === 0)) durationStr += `${minutes}min`;

  title = `${emojiStart} *CLOSE ${signal.symbol}*`;
  message = 
`${signal.symbol}
${emojiStart} Exit: $${formatPrice(signal.exit_price)} 
${emojiEnd}Result: (${profit}%)
${durationStr}`;
}
  } else {
  console.log('❌ Erro ao converter datas:', signal.created_at, signal.updated_at);
}

  

  try {
    const res = await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      ...(replyToMessageId && { reply_to_message_id: replyToMessageId }),
    });

    return res.data.result.message_id;
  } catch (error) {
    console.error('Erro ao enviar para o Telegram:', error.response?.data || error.message);
    return null;
  }
};

const sendToSecondTelegram = async (signal) => {
  let message = `🔔 *Alerta de Sinal: ${signal.symbol}*\n`;

  await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN_2}/sendMessage`, {
    chat_id: TELEGRAM_CHAT_ID_2,
    text: message,
    parse_mode: 'Markdown',
  });
};

module.exports = {
  sendToTelegram,
  sendToSecondTelegram,
};