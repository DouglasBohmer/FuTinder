import { useEffect, useState } from 'react'
import { MapPin, Users, Calendar, Clock, Filter, TrendingUp } from 'lucide-react'
import { api } from '../../services/api'

export default function JogosPublicos() {
  const [jogos, setJogos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [inscrevendo, setInscrevendo] = useState<number | null>(null)
  const [msgs, setMsgs] = useState<Record<number, string>>({})
  const [filtroNivel, setFiltroNivel] = useState('')

  const carregar = () => {
    api.get('/partidas/publicas')
      .then(setJogos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  const inscrever = async (id: number) => {
    setInscrevendo(id)
    try {
      await api.post(`/partidas/${id}/inscrever`)
      setMsgs(m => ({ ...m, [id]: 'Inscrição confirmada! ✓' }))
      carregar()
    } catch (e: any) {
      setMsgs(m => ({ ...m, [id]: e.message }))
    } finally { setInscrevendo(null) }
  }

  const getNivelColor = (nivel: string) => {
    if (nivel === 'Iniciante') return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (nivel === 'Avançado') return 'bg-zinc-700 text-zinc-300 border-zinc-600'
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  }

  const filtrados = filtroNivel ? jogos.filter(j => j.nivel === filtroNivel) : jogos

  const selectClass = "bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none"

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Jogos Públicos</h1>
        <p className="text-gray-400">Encontre partidas abertas e participe</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-green-500" />
          <h2 className="text-base font-bold text-white">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={filtroNivel} onChange={e => setFiltroNivel(e.target.value)} className={selectClass}>
            <option value="">Todos os níveis</option>
            <option>Iniciante</option><option>Intermediário</option><option>Avançado</option>
          </select>
          <select className={selectClass}>
            <option>Vagas disponíveis</option><option>1-2 vagas</option><option>3-5 vagas</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-gray-400 text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <p className="text-lg">Nenhum jogo público disponível no momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtrados.map(jogo => (
            <div key={jogo.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{jogo.nome}</h3>
                  <p className="text-gray-500 text-sm">Por {jogo.organizadorNome}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getNivelColor(jogo.nivel)}`}>{jogo.nivel}</span>
              </div>

              <div className="space-y-2.5 mb-5">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-white font-medium">{jogo.quadraNome}</p>
                    <p className="text-gray-500 text-xs">{jogo.quadraEndereco}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-gray-400"><Calendar className="w-4 h-4 text-green-600" />{jogo.data}</span>
                  <span className="flex items-center gap-1.5 text-gray-400"><Clock className="w-4 h-4 text-green-500" />{jogo.horario}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <Users className="w-4 h-4 text-gray-500" />{jogo.vagasDisponiveis} vagas de {jogo.vagasTotais}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />{jogo.quadraTipo}
                  </span>
                </div>
                <div className="bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                    style={{ width: `${(jogo.vagasPreenchidas / jogo.vagasTotais) * 100}%` }}></div>
                </div>
              </div>

              {msgs[jogo.id] && (
                <p className={`text-sm mb-3 font-medium ${msgs[jogo.id].includes('✓') ? 'text-green-400' : 'text-red-400'}`}>{msgs[jogo.id]}</p>
              )}

              {!msgs[jogo.id]?.includes('✓') && (
                <button onClick={() => inscrever(jogo.id)} disabled={inscrevendo === jogo.id || jogo.vagasDisponiveis === 0}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  {inscrevendo === jogo.id ? 'Inscrevendo...' : jogo.vagasDisponiveis === 0 ? 'Lotado' : 'Participar da Partida'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
