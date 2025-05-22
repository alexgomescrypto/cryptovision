// Signals.jsx com paginação e cores personalizadas para níveis
import React, { useState, useEffect } from 'react';
import { format, formatDistanceStrict } from 'date-fns';
import { createClient } from '@supabase/supabase-js';
import { ArrowUpCircle, ArrowDownCircle, X, CheckCircle, Clock, Target, Ban, LogIn, LogOut, CalendarDays } from 'lucide-react';



const supabase = createClient(
  'https://tnpysphwjohiaqpyedwv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucHlzcGh3am9oaWFxcHllZHd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njc0Mjk4MSwiZXhwIjoyMDYyMzE4OTgxfQ.nNMUCothOZH3mXZc7pZoZ-p82Yc2uN4fhiNmuil7Dx0'
);

const SignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [userPlan, setUserPlan] = useState(null);

useEffect(() => {
  const getUserPlanAndSignals = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    let planoFormatado = null;

    if (user) {
      console.log('📧 Email do usuário autenticado:', user.email);

      const { data: assinatura, error } = await supabase
        .from('assinaturas')
        .select('plano')
        .eq('email', user.email)
        .eq('status', 'ativo')
        .maybeSingle();

      if (error || !assinatura) {
        console.warn('⚠️ Nenhuma assinatura ativa encontrada para esse usuário.');
        planoFormatado = null; // Sem plano
      } else {
        planoFormatado = assinatura.plano.toLowerCase();
        console.log('✅ Plano ativo encontrado:', planoFormatado);
      }
    } else {
      console.warn('🕵️ Usuário não autenticado, carregando apenas sinais públicos.');
    }

    setUserPlan(planoFormatado);

    // Buscar sinais SEMPRE, mesmo se não tiver plano
    const { data: sinais, error: sinaisError } = await supabase
      .from('sinais_trade')
      .select('*');

    if (!sinaisError && sinais) {
      console.log('📊 Sinais carregados:', sinais.length);
      setSignals(sinais);
    } else {
      console.warn('❌ Erro ao buscar sinais:', sinaisError?.message);
    }

    setIsLoading(false);
  };

  getUserPlanAndSignals();

  const channel = supabase
    .channel('signals-updates')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'sinais_trade' },
      (payload) => {
        const { event, new: novo } = payload;
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch((err) => {
          console.warn('🔇 Erro ao reproduzir som:', err.message);
        });

        const showNotification = (title, body) => {
          if (Notification.permission === 'granted') {
            new Notification(title, {
              body,
              
            });
          }
        };

        audio.play();
        showNotification('📈 Novo sinal!', `${novo.symbol} - ${novo.signal_entry}`);

        setSignals((prev) => {
        const existingIndex = prev.findIndex(s => s.id === novo.id);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = novo;
          return updated;
        } else {
          return [novo, ...prev];
        }
      });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

const canViewSignal = (symbol) => {
  const level = getLevelTag(symbol);

  if (userPlan === 'premium') return true;
  if (userPlan === 'pro') return level === 'BASIC' || level === 'PRO';
  if (userPlan === 'basic') return level === 'BASIC';

  return false; // usuários sem plano não veem sinais abertos
};

//-FILTROS---SINAIS-------------------------------------------------------------------------------
  const filteredSignals = signals.filter(signal =>
    signal.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openSignals = filteredSignals.filter(s => s.signal_exit !== 'CLOSE').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const closedSignals = filteredSignals.filter(s => s.signal_exit === 'CLOSE').sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  // Aplicar paginação atualizada com pageSize dinâmico
  const paginatedClosed = closedSignals.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(closedSignals.length / pageSize);

  const calculateProfit = (entry, target, isBuy) => {const diff = isBuy ? (target - entry) : (entry - target); return ((diff / entry) * 100).toFixed(2);};
  const calculateLoss = (entry, stop, isBuy) => { const diff = isBuy ? (entry - stop) : (stop - entry);  return ((diff / entry) * 100).toFixed(2);};

  const getLevelTag = (symbol) => {
    const map = {
      'BTCUSDT': 'BASIC',
      'ETHUSDT': 'BASIC',
      'SOLUSDT': 'BASIC',
      'AVAXUSDT': 'PRO',
      'XRPUSDT': 'PREMIUM',
      'ADAUSDT': 'PREMIUM',
      'LINKUSDT': 'PREMIUM',
      'DOGEUSDT': 'PRO',
    };
    return map[symbol] || 'PREMIUM';
  };

  const getLevelColor = (level) => {
    if (level === 'BASIC') return 'bg-blue-200 text-blue-800';
    if (level === 'PRO') return 'bg-green-200 text-green-800';
    if (level === 'PREMIUM') return 'bg-yellow-200 text-yellow-800';
    return 'bg-slate-200 text-slate-800';
  };

const formatSymbolForMexc = (symbol) => {
  if (!symbol) return '';
  return symbol.replace('USDT', '_USDT');
};

  return (
    <div className="bg-[#0f172a] min-h-screen px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <h2 className="text-white text-2xl font-bold">Latest Trading Signals</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by coin..."
              className="bg-[#1e293b] text-white px-4 py-2 rounded border border-sky-500 focus:outline-none"
            />
            <button
              onClick={() => setSearchTerm('')}
              className="text-white flex items-center gap-1 border border-gray-500 hover:border-red-500 px-3 py-2 rounded"
            >
              <X size={16} /> Clear
            </button>
          </div>
        </div>

        {/* Open Signals mantido */}
        <h3 className="text-white flex items-center gap-2 text-lg mb-4">
            <Clock size={18} className="text-blue-400" /> Open Signals ({openSignals.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {openSignals.filter(signal => canViewSignal(signal.symbol)).map(signal => {
            const isBuy = signal.signal_entry === 'BUY';
            const profitPercent = calculateProfit(signal.entry_price, signal.take_profit, isBuy);
            const lossPercent = calculateLoss(signal.entry_price, signal.stop_loss, isBuy);
            const level = getLevelTag(signal.symbol);
            return (
              <div key={signal.id} className="rounded-lg overflow-hidden border border-white/10">
                <div className={`px-4 py-2 text-white font-bold flex justify-between items-center ${isBuy ? 'bg-green-600' : 'bg-red-600'}`}>
                  <span>{signal.symbol}</span>
                  <a
                    href={`https://www.mexc.com/pt-PT/futures/${formatSymbolForMexc(signal.symbol)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white text-[15px] px-3 py-[5px] rounded font-semibold hover:bg-yellow-400"
                  >
                    GO TO MEXC
                  </a>
                                  
                  <div className="flex items-center gap-2">
                    {signal.breakeven && (
                      <span className="bg-yellow-200 text-yellow-800 font-bold text-[15px] px-2 py-1 rounded-full">
                        BREAKEVEN
                      </span>
                    )}</div>
                    
                  <span className="flex items-center gap-1 text-sm">
                    {isBuy ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                    {signal.signal_entry}
                    
                  </span>
                </div>
                <div className="bg-[#1e293b] text-white font-bold text-[10px] p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><LogIn size={14} className="text-blue-400" /> Entry Price</span>
                    <span className="font-semibold">${Number(signal.entry_price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Target size={14} className="text-green-400" />Target</span>
                    <span className="text-green-400 font-bold">${Number(signal.take_profit).toLocaleString()} ({profitPercent}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Ban size={14} className="text-red-400" /> Stop Loss</span>
                    <span className="text-red-400 font-bold">${Number(signal.stop_loss).toLocaleString()} (-{lossPercent}%)</span>
                  </div>
                  <div className="text-xs text-gray-200 flex justify-between items-center pt-2">
                    
                    <span >Opened {format(new Date(signal.created_at),' MMM d, yyyy • HH:mm')}</span>

                    <span className={`text-[13px] px-4 py-1 rounded-full font-bold ${getLevelColor(level)}`}>{level}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
//---------------------------------------------------------------------------------------------------------------------
        {/* Closed Signals com quebra de linha e paginação */}
        <h3 className="text-white flex items-center gap-2 text-lg mb-4">
          <CheckCircle size={18} className="text-green-400" /> Closed Signals ({closedSignals.length})
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
  {paginatedClosed.map(signal => {
    const openedAt = new Date(signal.created_at);
    const closedAt = new Date(signal.updated_at);
    const duration = formatDistanceStrict(openedAt, closedAt);
    const level = getLevelTag(signal.symbol);
    const profit = Number(signal.resultado).toFixed(2);
    
    return (
      <div key={signal.id} className="rounded-xl bg-[#1e293b] text-white shadow-md border border-slate-600 overflow-hidden">
        <div className={`flex items-center justify-between px-4 py-2 font-bold ${signal.signal_entry === 'BUY' ? 'bg-green-600' : 'bg-red-600'}`}>
          <span>{signal.symbol}</span>
          <div className="flex items-center gap-2">
                    {signal.breakeven && (
                      <span className="bg-yellow-200 text-yellow-800 font-bold text-[10px] px-2 py-1 rounded-full">
                        BREAKEVEN
                      </span>
                    )}</div>
          <span className="flex items-center gap-1 text-sm uppercase">
            {signal.signal_entry === 'BUY' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
            {signal.signal_entry}
          </span>
        </div>
        <div className="p-4 text-sm space-y-2">
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <span className="flex items-center gap-1"><LogIn size={14} className="text-blue-400" /> Entry Price</span>
              <p>${Number(signal.entry_price).toLocaleString()}</p>
            </div>
            
            <div className="flex-1 text-right">
              <p className="text-gray-400 text-xs">Exit</p> 
              <p>${Number(signal.exit_price).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <span className="flex items-center gap-1"><Target size={14} className="text-green-400" />Target</span>
              <p className="text-green-400">${Number(signal.take_profit).toLocaleString()}</p>
            </div>
            <div className="flex-1">
              <span className="flex items-center gap-1"><Ban size={14} className="text-red-400" /> Stop Loss</span>
              <p className="text-red-400">${Number(signal.stop_loss).toLocaleString()}</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-gray-400 text-xs">Result</p>
              <p className={`${profit >= 0 ? 'text-green-400' : 'text-red-400'} font-bold`}>{profit}%</p>
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-2 text-xs text-gray-400">
  <div className="flex-1">
    <p className="text-gray-400 text-xs">Opened</p>
    <p>{format(openedAt, 'MMM d, yyyy • HH:mm')}</p>
  </div>
  <div className="flex-1">
    <p className="text-gray-400 text-xs">Closed</p>
    <p>{format(closedAt, 'MMM d, yyyy • HH:mm')}</p>
  </div>
</div>
<div className="flex justify-between gap-4 text-xs text-gray-400">
  <div className="flex-1">
    <p className="text-gray-400 text-xs">Duration: <span className="text-blue-300">{duration}</span></p>
  </div>
  <div className="flex-1 text-right">
        <span className={`inline-block px-2 py-1 text-[10px] rounded-full font-semibold ${getLevelColor(level)}`}>{level}</span>
  </div>
</div>
        </div>
      </div>
    );
  })}
</div>

{/* Pagination */}
<div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
  <div className="flex items-center gap-2 text-white">
    <label htmlFor="pageSize">Results per page:</label>
    <select
      id="pageSize"
      value={pageSize}
      onChange={(e) => {
        setPage(1);
        setPageSize(Number(e.target.value));
      }}
      className="bg-slate-700 border border-slate-500 px-2 py-1 rounded text-white"
    >
      {[5, 10, 20, 50].map(size => (
        <option key={size} value={size}>{size}</option>
      ))}
    </select>
  </div>
  <div className="flex items-center gap-4">
    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className={`px-3 py-1 rounded ${page === 1 ? 'bg-slate-800 text-gray-500 cursor-not-allowed' : 'bg-slate-700 text-white'}`}
    >
      &lt;
    </button>
    <span className="text-white">Page {page} of {totalPages}</span>
    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className={`px-3 py-1 rounded ${page === totalPages ? 'bg-slate-800 text-gray-500 cursor-not-allowed' : 'bg-slate-700 text-white'}`}
    >
      &gt;
    </button>
  </div>
</div>
</div>
</div>
  );
};

export default SignalsPage;
