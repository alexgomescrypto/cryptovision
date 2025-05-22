import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Admin() {
  const [sinais, setSinais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // sinal em edição
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSinais();
  }, []);

  const fetchSinais = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sinais_trade')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Erro ao buscar sinais:', error);
    else setSinais(data);
    setLoading(false);
  };

  const openEditModal = (sinal) => {
    setEditing(sinal);
    setFormData({ ...sinal });
  };

  const closeEditModal = () => {
    setEditing(null);
    setFormData({});
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
  setSaving(true);

  const parseNum = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  };

  const fields = {
    msg: formData.msg || null,
    signal_entry: formData.signal_entry || null,
    signal_exit: formData.signal_exit || null,
    entry_price: parseNum(formData.entry_price),
    exit_price: parseNum(formData.exit_price),
    symbol: formData.symbol || null,
    take_profit: parseNum(formData.take_profit),
    stop_loss: parseNum(formData.stop_loss),
    resultado: parseNum(formData.resultado),
    breakeven: formData.breakeven || null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('sinais_trade')
    .update(fields)
    .eq('id', formData.id);

  if (error) {
    alert('Erro ao salvar: ' + error.message);
  } else {
    alert('Sinal atualizado com sucesso!');
    await fetchSinais();
    closeEditModal();
  }

  setSaving(false);
};

  const handleDelete = async (id) => {
  const confirm = window.confirm("Tem certeza que deseja deletar este sinal?");
  if (!confirm) return;

  const { error } = await supabase.from('sinais_trade').delete().eq('id', id);
  if (error) {
    alert('Erro ao deletar: ' + error.message);
  } else {
    alert('Sinal deletado com sucesso!');
    await fetchSinais();
  }
  }; 

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24 relative">
      <h1 className="text-3xl font-bold mb-8 text-center">Painel Administrativo de Sinais</h1>

      {loading ? (
        <p className="text-center">Carregando sinais...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full table-auto text-sm text-left text-gray-300 border border-gray-700">
            <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-2">Moeda</th>
                <th className="px-4 py-2">Msg</th>

                <th className="px-4 py-2">Resultado</th>
                <th className="px-4 py-2">Criado em</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sinais.map((sinal) => (
                <tr key={sinal.id} className="border-t border-gray-700">
                  <td className="px-4 py-2">{sinal.symbol}</td>
                  <td className="px-4 py-2">{sinal.msg}</td>

                  <td className="px-4 py-2">{sinal.resultado}</td>
                  <td className="px-4 py-2">{new Date(sinal.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openEditModal(sinal)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                    onClick={() => handleDelete(sinal.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    Deletar
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de edição */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-3xl relative">
            <h2 className="text-2xl font-bold mb-4">Editar Sinal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              <Input label="Moeda" value={formData.symbol} onChange={(v) => handleChange('symbol', v)} />
              <Input label="Mensagem" value={formData.msg} onChange={(v) => handleChange('msg', v)} />
              <Input label="Signal Entry" value={formData.signal_entry} onChange={(v) => handleChange('signal_entry', v)} />
              <Input label="Signal Exit" value={formData.signal_exit} onChange={(v) => handleChange('signal_exit', v)} />
              <Input label="Entry Price" value={formData.entry_price} onChange={(v) => handleChange('entry_price', v)} />
              <Input label="Exit Price" value={formData.exit_price} onChange={(v) => handleChange('exit_price', v)} />
              <Input label="Take Profit" value={formData.take_profit} onChange={(v) => handleChange('take_profit', v)} />
              <Input label="Stop Loss" value={formData.stop_loss} onChange={(v) => handleChange('stop_loss', v)} />
              <Input label="Resultado" value={formData.resultado} onChange={(v) => handleChange('resultado', v)} />
              <Input label="Breakeven" value={formData.breakeven} onChange={(v) => handleChange('breakeven', v)} />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={closeEditModal}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
