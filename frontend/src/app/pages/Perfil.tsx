import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Trophy, Calendar, CheckCircle2, Star, MapPin, Target, LogOut, Settings } from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Perfil() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/usuarios/perfil')
      .then(setPerfil)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!perfil) return <div className="text-red-400">Perfil não encontrado</div>

  const stats = [
    { icon: Trophy, color: 'text-green-500', bg: 'bg-green-500/20', label: 'Partidas', val: String(perfil.jogosRealizados || 0) },
    { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Confirmadas', val: String(perfil.jogosRealizados || 0) },
    { icon: Calendar, color: 'text-zinc-300', bg: 'bg-zinc-700', label: 'Este Mês', val: '0' },
    { icon: Star, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Avaliação', val: '4.8' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
          <p className="text-gray-400">Veja suas estatísticas e informações</p>
        </div>
        <Link to="/configuracoes"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all">
          <Settings className="w-4 h-4 text-green-400" />Editar Perfil
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            {perfil.foto ? (
              <img src={perfil.foto} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-zinc-700" alt="Foto de perfil" />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4">
                {perfil.nome?.charAt(0)}
              </div>
            )}
            <h2 className="text-2xl font-bold text-white mb-1">{perfil.nome}</h2>
            <p className="text-gray-400 text-sm mb-3">{perfil.email}</p>
            {perfil.posicao && (
              <div className="bg-green-500/20 text-green-400 rounded-full px-4 py-1.5 text-sm font-medium inline-flex items-center gap-1 mb-3 border border-green-500/30">
                <Target className="w-4 h-4" />{perfil.posicao}
              </div>
            )}
            {(perfil.cidade || perfil.estado) && (
              <p className="text-gray-400 text-sm flex items-center justify-center gap-1 mt-2">
                <MapPin className="w-4 h-4" />
                {[perfil.cidade, perfil.estado].filter(Boolean).join(' — ')}
              </p>
            )}
            {perfil.preferencias && (
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                {perfil.preferencias.split(',').map((p: string) => (
                  <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-gray-300 border border-zinc-700 capitalize">{p}</span>
                ))}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-red-500/10 border border-zinc-700 hover:border-red-500/40 text-gray-400 hover:text-red-400 rounded-xl transition-all text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ icon: Icon, color, bg, label, val }) => (
              <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{label}</p>
                  <p className="text-2xl font-bold text-white">{val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Informações</h3>
            <div className="space-y-3">
              {[
                { label: 'Nome', val: perfil.nome },
                { label: 'E-mail', val: perfil.email },
                { label: 'Cidade', val: perfil.cidade || 'Não informado' },
                { label: 'Estado', val: perfil.estado || 'Não informado' },
                { label: 'Posição Favorita', val: perfil.posicao || 'Não informada' },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-white font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-6">
            <h3 className="text-white font-bold mb-2">Nível de Jogador</h3>
            <p className="text-gray-400 text-sm mb-3">Baseado em suas partidas realizadas</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-zinc-800 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                  style={{ width: `${Math.min(((perfil.jogosRealizados || 0) / 50) * 100, 100)}%` }}></div>
              </div>
              <span className="text-green-400 font-bold">{perfil.jogosRealizados || 0}/50</span>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              {(perfil.jogosRealizados || 0) >= 50 ? '🏆 Veterano' : (perfil.jogosRealizados || 0) >= 20 ? '⭐ Intermediário' : '🌱 Iniciante'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
