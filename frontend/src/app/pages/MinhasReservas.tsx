import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Calendar, Clock, MapPin, Users, Trophy, Plus } from 'lucide-react'
import { api } from '../../services/api'

export default function MinhasReservas() {
  const [partidas, setPartidas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todas')

  useEffect(() => {
    api.get('/partidas/minhas')
      .then(setPartidas)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtradas = partidas.filter(p => {
    if (filtro === 'ativas') return !p.cancelada
    if (filtro === 'canceladas') return p.cancelada
    if (filtro === 'organizando') return p.isOrganizador
    return true
  })

  const getStatusStyle = (p: any) => {
    if (p.cancelada) return 'bg-red-500/20 text-red-400 border-red-500/30'
    if (p.vagasDisponiveis === 0) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    return 'bg-green-500/20 text-green-400 border-green-500/30'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />Minhas Reservas
          </h1>
          <p className="text-gray-400">Gerencie todas as suas partidas</p>
        </div>
        <Link to="/reserva" className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30">
          <Plus className="w-5 h-5" />Nova Reserva
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { val: 'todas', label: 'Todas' },
          { val: 'ativas', label: 'Ativas' },
          { val: 'organizando', label: 'Organizando' },
          { val: 'canceladas', label: 'Canceladas' },
        ].map(({ val, label }) => (
          <button key={val} onClick={() => setFiltro(val)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${filtro === val ? 'bg-green-500 text-white' : 'bg-zinc-900 border border-zinc-800 text-gray-400 hover:bg-zinc-800'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-16">Carregando suas reservas...</div>
      ) : filtradas.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Nenhuma reserva encontrada</p>
          <Link to="/reserva" className="inline-flex items-center gap-2 bg-green-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors">
            <Plus className="w-5 h-5" />Criar Primeira Reserva
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtradas.map(p => (
            <Link key={p.id} to={`/partida/${p.id}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="text-xl font-bold text-white">{p.nome}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(p)}`}>{p.status}</span>
                    {p.isOrganizador && <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-700 text-zinc-300 border border-zinc-600">Organizador</span>}
                    {!p.publica && <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-700 text-zinc-400">Privada</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" />{p.data}</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-green-500" />{p.horario}</span>
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" />{p.quadraNome}</span>
                    <span className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" />{p.vagasPreenchidas}/{p.vagasTotais} jogadores</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">{p.nivel}</p>
                  <p className="text-green-400 font-bold">R$ {p.quadraPreco?.toFixed(0)}</p>
                </div>
              </div>
              <div className="mt-4 bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                  style={{ width: `${(p.vagasPreenchidas / p.vagasTotais) * 100}%` }}></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
