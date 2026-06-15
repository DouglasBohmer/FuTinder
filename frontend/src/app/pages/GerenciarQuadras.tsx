import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Shield, Plus, Pencil, Trash2, X, MapPin, Users, Layers } from 'lucide-react'

interface Quadra {
  id: number
  nome: string
  endereco: string
  tipo: string
  capacidade: number
  preco: number
  emoji: string
}

const TIPOS = ['Society', 'Campo', 'Futsal']
const EMOJIS = ['⚽', '🏟️', '🏆', '🎯', '🏃', '🥅', '🌟']

const emptyForm = { nome: '', endereco: '', tipo: 'Society', capacidade: 10, emoji: '⚽' }

function formatReais(cents: number): string {
  const value = (cents / 100).toFixed(2)
  const [int, dec] = value.split('.')
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `R$ ${intFormatted},${dec}`
}

export default function GerenciarQuadras() {
  const [quadras, setQuadras] = useState<Quadra[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Quadra | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [priceCents, setPriceCents] = useState(0)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<Quadra | null>(null)

  const carregar = async () => {
    try { const data = await api.get('/quadras'); setQuadras(data) }
    finally { setLoading(false) }
  }

  useEffect(() => { carregar() }, [])

  const abrirNova = () => {
    setEditando(null); setForm(emptyForm); setPriceCents(0); setErro(''); setModalOpen(true)
  }

  const abrirEditar = (q: Quadra) => {
    setEditando(q)
    setForm({ nome: q.nome, endereco: q.endereco, tipo: q.tipo, capacidade: q.capacidade, emoji: q.emoji || '⚽' })
    setPriceCents(Math.round((q.preco || 0) * 100))
    setErro(''); setModalOpen(true)
  }

  const fecharModal = () => { setModalOpen(false); setEditando(null); setErro('') }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '')
    const cents = Math.min(parseInt(digits || '0', 10), 9999999)
    setPriceCents(cents)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim() || !form.endereco.trim()) { setErro('Nome e endereço são obrigatórios'); return }
    setSalvando(true); setErro('')
    const payload = { ...form, preco: priceCents / 100 }
    try {
      if (editando) { await api.put(`/quadras/${editando.id}`, payload) }
      else { await api.post('/quadras', payload) }
      fecharModal(); carregar()
    } catch (err: any) { setErro(err.message) }
    finally { setSalvando(false) }
  }

  const handleDeletar = async (q: Quadra) => {
    try { await api.delete(`/quadras/${q.id}`); setConfirmDelete(null); carregar() }
    catch (err: any) { alert(err.message) }
  }

  const set = (k: string) => (e: any) =>
    setForm(f => ({ ...f, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
  const iconInputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Gerenciar Quadras</h1>
            <p className="text-gray-500 text-sm">{quadras.length} quadra{quadras.length !== 1 ? 's' : ''} cadastrada{quadras.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={abrirNova}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-green-500/20">
          <Plus className="w-5 h-5" />Nova Quadra
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : quadras.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <div className="text-5xl mb-4">🏟️</div>
          <p className="text-gray-400 text-lg">Nenhuma quadra cadastrada ainda</p>
          <p className="text-gray-600 text-sm mt-1">Clique em "Nova Quadra" para começar</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quadras.map(q => (
            <div key={q.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{q.emoji || '⚽'}</span>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{q.nome}</h3>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium ${
                      q.tipo === 'Campo' ? 'bg-green-500/20 text-green-400' :
                      q.tipo === 'Futsal' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-zinc-700 text-zinc-300'
                    }`}>{q.tipo}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => abrirEditar(q)}
                    className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors text-gray-500 hover:text-white">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setConfirmDelete(q)}
                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-gray-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{q.endereco}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{q.capacidade} jogadores</span>
                  <span className="text-green-400 font-semibold">{formatReais(Math.round((q.preco || 0) * 100))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={fecharModal} />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">{editando ? 'Editar Quadra' : 'Nova Quadra'}</h2>
              <button onClick={fecharModal} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="p-6 space-y-4">
              {erro && <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">{erro}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Quadra *</label>
                <input value={form.nome} onChange={set('nome')} placeholder="Arena Sports Center" required className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Endereço *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input value={form.endereco} onChange={set('endereco')} placeholder="Av. Paulista, 1000 - São Paulo" required className={iconInputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <select value={form.tipo} onChange={set('tipo')} className={`${iconInputClass} appearance-none`}>
                      {TIPOS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Capacidade</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="number" min={2} max={100} value={form.capacidade} onChange={set('capacidade')} className={iconInputClass} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preço por hora</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatReais(priceCents)}
                  onChange={handlePriceChange}
                  className={inputClass + ' font-mono'}
                  placeholder="R$ 0,00"
                />
                <p className="text-gray-600 text-xs mt-1">Digite apenas números — o valor é formatado automaticamente</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ícone</label>
                <div className="flex gap-2 flex-wrap">
                  {EMOJIS.map(em => (
                    <button key={em} type="button" onClick={() => setForm(f => ({ ...f, emoji: em }))}
                      className={`w-10 h-10 text-xl rounded-xl flex items-center justify-center transition-all border ${
                        form.emoji === em ? 'bg-green-500/20 border-green-500/50 scale-110' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-500'
                      }`}>
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={fecharModal}
                  className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold rounded-xl transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-50">
                  {salvando ? 'Salvando...' : editando ? 'Salvar' : 'Criar Quadra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="text-lg font-bold text-white mb-2">Remover Quadra</h3>
            <p className="text-gray-400 text-sm mb-6">
              Tem certeza que deseja remover <span className="text-white font-semibold">{confirmDelete.nome}</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold rounded-xl transition-all">
                Cancelar
              </button>
              <button onClick={() => handleDeletar(confirmDelete)}
                className="flex-1 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold rounded-xl transition-all">
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
