import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { Calendar, Clock, MapPin, Users, UserCheck, UserX, Trophy } from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function RespostaConvite() {
  const { token } = useParams()
  const { user } = useAuth()
  const [partida, setPartida] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [resposta, setResposta] = useState<'confirmado' | 'recusado' | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api.get(`/partidas/convite/${token}`)
      .then(setPartida)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false))
  }, [token])

  const confirmar = async () => {
    if (!user) { window.location.href = `/login?redirect=/convite/${token}`; return }
    setConfirmando(true); setErro('')
    try {
      await api.post(`/partidas/${partida.id}/inscrever`)
      setResposta('confirmado')
    } catch (e: any) {
      setErro(e.message)
    } finally { setConfirmando(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-gray-400">Carregando convite...</div>
    </div>
  )

  if (erro && !partida) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-md w-full">
        <div className="text-4xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-white mb-2">Convite Inválido</h2>
        <p className="text-gray-400 mb-6">{erro}</p>
        <Link to="/" className="bg-green-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors">Ir ao Dashboard</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">FuTinder</span>
        </div>

        {resposta === 'confirmado' ? (
          <div className="bg-zinc-900 border border-green-500/30 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Presença Confirmada!</h2>
            <p className="text-gray-400 mb-2">Você está confirmado para <span className="text-white font-semibold">{partida?.nome}</span></p>
            <p className="text-gray-500 text-sm mb-6">{partida?.data} às {partida?.horario} — {partida?.quadraNome}</p>
            <Link to={user ? '/' : '/login'} className="block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 text-center">
              {user ? 'Ver Dashboard' : 'Fazer Login'}
            </Link>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <p className="text-center text-gray-400 mb-2 text-sm">Você recebeu um convite para</p>
            <h1 className="text-3xl font-bold text-white text-center mb-6">{partida?.nome}</h1>

            <div className="space-y-4 mb-6">
              {[
                { icon: MapPin, color: 'text-red-500', bg: 'bg-red-500/20', val: partida?.quadraNome, sub: partida?.quadraEndereco },
                { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/20', val: partida?.data },
                { icon: Clock, color: 'text-green-500', bg: 'bg-green-500/20', val: partida?.horario },
                { icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/20', val: `${partida?.vagasDisponiveis} vagas disponíveis de ${partida?.vagasTotais}` },
              ].map(({ icon: Icon, color, bg, val, sub }: any) => (
                <div key={val} className="flex items-center gap-4">
                  <div className={`w-11 h-11 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{val}</p>
                    {sub && <p className="text-gray-400 text-sm">{sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            {erro && <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">{erro}</div>}

            {!user && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 mb-4 text-sm text-yellow-400">
                Você precisa estar logado para confirmar presença.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setResposta('recusado')}
                className="flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 text-white font-semibold py-3 rounded-xl hover:bg-zinc-700 transition-all">
                <UserX className="w-5 h-5 text-red-400" />Não posso
              </button>
              <button onClick={confirmar} disabled={confirmando}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50">
                <UserCheck className="w-5 h-5" />{confirmando ? 'Confirmando...' : 'Confirmar!'}
              </button>
            </div>

            {resposta === 'recusado' && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                <p className="text-gray-400">Que pena! Você recusou o convite.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
