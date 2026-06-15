import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { Calendar, Clock, MapPin, Users, Share2, Globe, UserCheck, UserPlus, Search, LogOut } from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function DetalhesPartida() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [partida, setPartida] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [msg, setMsg] = useState('')

  const carregar = () => {
    api.get(`/partidas/${id}`)
      .then(setPartida)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [id])

  const togglePublico = async () => {
    try { await api.put(`/partidas/${id}/toggle-publico`); carregar() }
    catch (e: any) { setErro(e.message) }
  }

  const cancelar = async () => {
    if (!confirm('Tem certeza que deseja cancelar a partida?')) return
    try { await api.delete(`/partidas/${id}`); navigate('/minhas-reservas') }
    catch (e: any) { setErro(e.message) }
  }

  const inscrever = async () => {
    try { await api.post(`/partidas/${id}/inscrever`); setMsg('Inscrição confirmada!'); carregar() }
    catch (e: any) { setErro(e.message) }
  }

  const sair = async () => {
    if (!confirm('Tem certeza que deseja sair desta partida?')) return
    try { await api.delete(`/partidas/${id}/sair`); setMsg('Você saiu da partida.'); carregar() }
    catch (e: any) { setErro(e.message) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!partida) return <div className="text-red-400">{erro || 'Partida não encontrada'}</div>

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <Link to="/" className="hover:text-green-400 transition-colors">Dashboard</Link>
          <span>/</span><span className="text-gray-400">Detalhes da Partida</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{partida.nome}</h1>
        <p className="text-gray-400">Gerencie sua partida e convide jogadores</p>
      </div>

      {erro && <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{erro}</div>}
      {msg && <div className="bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 mb-6 text-sm">{msg}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Informações da Partida</h2>
            <div className="space-y-4">
              {[
                { icon: Calendar, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Data', val: partida.data },
                { icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Horário', val: partida.horario },
                { icon: MapPin, color: 'text-zinc-400', bg: 'bg-zinc-700', label: 'Local', val: partida.quadraNome, sub: partida.quadraEndereco },
              ].map(({ icon: Icon, color, bg, label, val, sub }: any) => (
                <div key={label} className="flex items-center gap-4">
                  <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">{label}</p>
                    <p className="text-white font-semibold">{val}</p>
                    {sub && <p className="text-gray-500 text-sm">{sub}</p>}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-500 text-xs mb-1">Jogadores</p>
                  <div className="flex items-center gap-3">
                    <p className="text-white font-semibold">{partida.vagasPreenchidas} / {partida.vagasTotais}</p>
                    <div className="flex-1 bg-zinc-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                        style={{ width: `${(partida.vagasPreenchidas / partida.vagasTotais) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-gray-500 text-sm">Status da Partida</span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${partida.cancelada ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                {partida.status}
              </span>
            </div>
          </div>

          {partida.jogadores && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-green-500" />
                Jogadores Confirmados ({partida.confirmados || 0})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {partida.jogadores.filter((j: any) => j.status === 'CONFIRMADO').map((j: any) => (
                  <div key={j.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0">
                      {j.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{j.nome}</p>
                      <p className="text-gray-500 text-sm">{j.posicao || 'Jogador'}</p>
                    </div>
                  </div>
                ))}
              </div>
              {partida.vagasDisponiveis > 0 && (
                <div className="mt-5 bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-green-500" />
                    Ainda faltam <span className="text-green-400 font-semibold">{partida.vagasDisponiveis}</span> jogador(es) para completar
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24 space-y-3">
            <h2 className="text-lg font-bold text-white mb-4">Ações</h2>

            {partida.isOrganizador ? (
              <>
                <Link to={`/partida/${id}/convite`}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/20">
                  <Share2 className="w-4 h-4" />Compartilhar Convite
                </Link>
                <Link to="/buscar-jogadores"
                  className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold py-3 rounded-xl transition-all">
                  <Search className="w-4 h-4 text-green-400" />Buscar Jogadores
                </Link>
                <button onClick={togglePublico}
                  className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold py-3 rounded-xl transition-all">
                  <Globe className="w-4 h-4 text-green-400" />{partida.publica ? 'Tornar Privada' : 'Tornar Pública'}
                </button>
              </>
            ) : !partida.usuarioInscrito ? (
              <button onClick={inscrever}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/20">
                <UserPlus className="w-4 h-4" />Participar da Partida
              </button>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 w-full bg-green-500/20 text-green-400 font-semibold py-3 rounded-xl border border-green-500/30">
                  <UserCheck className="w-4 h-4" />Você está inscrito
                </div>
                <button onClick={sair}
                  className="flex items-center justify-center gap-2 w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold py-2.5 rounded-xl transition-all text-sm">
                  <LogOut className="w-4 h-4" />Sair da Partida
                </button>
              </>
            )}

            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-white font-semibold mb-3 text-sm">Informações</h3>
              <div className="space-y-2.5 text-sm">
                {[
                  { label: 'Organizador', val: partida.organizadorNome },
                  { label: 'Nível', val: partida.nivel },
                  { label: 'Visibilidade', val: partida.publica ? 'Pública' : 'Privada', green: partida.publica },
                  { label: 'Vagas Restantes', val: String(partida.vagasDisponiveis), green: true },
                ].map(({ label, val, green }: any) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className={`font-medium ${green ? 'text-green-400' : 'text-white'}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {partida.isOrganizador && !partida.cancelada && (
              <div className="pt-4 border-t border-zinc-800">
                <button onClick={cancelar} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-2.5 rounded-xl transition-all border border-red-500/20 text-sm">
                  Cancelar Partida
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
