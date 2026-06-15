import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Calendar, Users, Clock, MapPin, Plus, TrendingUp, Trophy, CheckCircle2 } from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [partidas, setPartidas] = useState<any[]>([])
  const [publicas, setPublicas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/partidas/minhas'), api.get('/partidas/publicas')])
      .then(([m, p]) => { setPartidas(m); setPublicas(p.slice(0, 2)) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const proximas = partidas.filter((p: any) => !p.cancelada).slice(0, 3)
  const totalConfirmados = partidas.filter((p: any) => p.usuarioInscrito).length
  const taxaPresenca = partidas.length > 0 ? Math.round((totalConfirmados / partidas.length) * 100) : 0

  const estatisticas = [
    { label: 'Partidas', valor: String(partidas.length), icon: Trophy, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Confirmadas', valor: String(totalConfirmados), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Taxa Presença', valor: `${taxaPresenca}%`, icon: TrendingUp, color: 'text-zinc-300', bg: 'bg-zinc-800' },
    { label: 'Públicas', valor: String(publicas.length), icon: Users, color: 'text-gray-300', bg: 'bg-zinc-800' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Bem-vindo de volta, {user?.nome?.split(' ')[0]}! 👋</p>
        </div>
        <Link to="/reserva"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30">
          <Plus className="w-5 h-5" />Criar Nova Partida
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {estatisticas.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.valor}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />Próximas Partidas
            </h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-7 h-7 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : proximas.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Nenhuma partida agendada</p>
                <Link to="/reserva" className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">Reservar uma quadra →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {proximas.map((p: any) => (
                  <Link key={p.id} to={`/partida/${p.id}`}
                    className="block bg-zinc-800 rounded-xl p-4 hover:bg-zinc-700/50 transition-all border border-zinc-700 hover:border-zinc-600">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold mb-1">{p.nome}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{p.data}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{p.horario}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.cancelada ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{p.quadraNome}</span>
                      <span className="text-gray-500 flex items-center gap-1"><Users className="w-3.5 h-3.5" />{p.vagasPreenchidas}/{p.vagasTotais}</span>
                    </div>
                    <div className="mt-3 bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                        style={{ width: `${(p.vagasPreenchidas / p.vagasTotais) * 100}%` }}></div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />Jogos Públicos
            </h2>
            {publicas.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Nenhum jogo público disponível</p>
            ) : (
              <div className="space-y-3">
                {publicas.map((j: any) => (
                  <div key={j.id} className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm">{j.quadraNome}</h3>
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/30">{j.vagasDisponiveis} vagas</span>
                    </div>
                    <p className="text-gray-500 text-xs mb-3">{j.data} • {j.nivel}</p>
                    <Link to="/jogos-publicos"
                      className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition-all text-center">
                      Ver Detalhes
                    </Link>
                  </div>
                ))}
              </div>
            )}
            <Link to="/jogos-publicos" className="block mt-4 text-center text-green-400 hover:text-green-300 text-sm transition-colors font-medium">
              Ver todos os jogos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
