import { useState, FormEvent } from 'react'
import { Search, MapPin, Target, Users, Filter } from 'lucide-react'
import { api } from '../../services/api'

const POSICOES = ['', 'Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante']

const PREFS_EMOJI: Record<string, string> = {
  campo: '🏟️', society: '⚽', futsal: '🏃'
}

const POSICAO_COLOR: Record<string, string> = {
  Goleiro: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Zagueiro: 'bg-zinc-700 text-zinc-300 border-zinc-600',
  Lateral: 'bg-zinc-700 text-zinc-300 border-zinc-600',
  Volante: 'bg-green-500/20 text-green-400 border-green-500/30',
  Meia: 'bg-green-500/20 text-green-400 border-green-500/30',
  Atacante: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

const inputClass = "bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"

export default function BuscarJogadores() {
  const [nome, setNome] = useState('')
  const [posicao, setPosicao] = useState('')
  const [cidade, setCidade] = useState('')
  const [jogadores, setJogadores] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [buscou, setBuscou] = useState(false)

  const buscar = async (e?: FormEvent) => {
    e?.preventDefault()
    setLoading(true); setErro(''); setBuscou(true)
    const params = new URLSearchParams()
    if (nome.trim()) params.set('nome', nome.trim())
    if (posicao) params.set('posicao', posicao)
    if (cidade.trim()) params.set('cidade', cidade.trim())
    try {
      const data = await api.get(`/usuarios/buscar?${params}`)
      setJogadores(data as any[])
    } catch (e: any) {
      setErro(e.message)
      setJogadores([])
    } finally {
      setLoading(false)
    }
  }

  const limpar = () => {
    setNome(''); setPosicao(''); setCidade('')
    setJogadores(null); setBuscou(false); setErro('')
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-green-400" />
          </div>
          Buscar Jogadores
        </h1>
        <p className="text-gray-400 ml-13">Encontre jogadores por posição, cidade ou nome para convidar às suas partidas</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Filter className="w-4 h-4" />Filtros de Busca
        </h2>
        <form onSubmit={buscar} className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Nome</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                placeholder="Buscar por nome..." className={`${inputClass} w-full pl-9`} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Posição</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select value={posicao} onChange={e => setPosicao(e.target.value)}
                className={`${inputClass} w-full pl-9 appearance-none`}>
                <option value="">Todas</option>
                {POSICOES.filter(Boolean).map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Cidade</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={cidade} onChange={e => setCidade(e.target.value)}
                placeholder="Filtrar cidade..." className={`${inputClass} w-full pl-9`} />
            </div>
          </div>
          <div className="md:col-span-4 flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />{loading ? 'Buscando...' : 'Buscar Jogadores'}
            </button>
            {buscou && (
              <button type="button" onClick={limpar}
                className="px-5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-gray-400 hover:text-white font-semibold py-3 rounded-xl transition-all">
                Limpar
              </button>
            )}
          </div>
        </form>
      </div>

      {erro && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{erro}</div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && jogadores !== null && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">
              {jogadores.length === 0 ? 'Nenhum jogador encontrado' : (
                <><span className="text-white font-semibold">{jogadores.length}</span> jogador{jogadores.length !== 1 ? 'es' : ''} encontrado{jogadores.length !== 1 ? 's' : ''}</>
              )}
            </p>
          </div>

          {jogadores.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
              <Users className="w-14 h-14 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Nenhum jogador encontrado</p>
              <p className="text-gray-600 text-sm">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jogadores.map((j: any) => (
                <div key={j.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0">
                      {j.nome?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{j.nome}</h3>
                      {j.posicao && (
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border mt-1 font-medium ${POSICAO_COLOR[j.posicao] || 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>
                          <Target className="w-3 h-3" />{j.posicao}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {(j.cidade || j.estado) && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{[j.cidade, j.estado].filter(Boolean).join(' — ')}</span>
                      </div>
                    )}
                    {j.preferencias && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {j.preferencias.split(',').filter(Boolean).map((p: string) => (
                          <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-gray-400 border border-zinc-700 capitalize">
                            {PREFS_EMOJI[p] || ''} {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!buscou && !loading && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-green-500/60" />
          </div>
          <p className="text-gray-400 mb-1">Use os filtros acima para encontrar jogadores</p>
          <p className="text-gray-600 text-sm">Filtre por nome, posição ou cidade</p>
        </div>
      )}
    </div>
  )
}
