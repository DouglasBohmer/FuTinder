import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link2, Copy, Users, Calendar, Clock, MapPin, Share2, Check } from 'lucide-react'
import { api } from '../../services/api'

export default function ConviteLink() {
  const { id } = useParams()
  const [partida, setPartida] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    api.get(`/partidas/${id}`)
      .then(setPartida)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const linkConvite = partida ? `${window.location.origin}/convite/${partida.linkConvite}` : ''

  const copiarLink = () => {
    navigator.clipboard.writeText(linkConvite)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-400">Carregando...</div></div>
  if (!partida) return <div className="text-red-400">Partida não encontrada</div>

  const preenchidos = partida.vagasTotais - partida.vagasDisponiveis

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Link2 className="w-8 h-8 text-blue-500" />Link de Convite
        </h1>
        <p className="text-gray-400">Compartilhe o link abaixo com seus amigos</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">{partida.nome}</h2>
            <div className="space-y-3">
              {[
                { icon: Calendar, color: 'text-blue-500', val: partida.data },
                { icon: Clock, color: 'text-green-500', val: partida.horario },
                { icon: MapPin, color: 'text-red-500', val: partida.quadraNome },
              ].map(({ icon: Icon, color, val }) => (
                <div key={val} className="flex items-center gap-3 text-gray-400">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />Status de Vagas
            </h2>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Confirmados</span>
                <span className="text-white font-semibold">{preenchidos}/{partida.vagasTotais}</span>
              </div>
              <div className="bg-zinc-700 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                  style={{ width: `${(preenchidos / partida.vagasTotais) * 100}%` }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                <p className="text-green-400 text-2xl font-bold">{preenchidos}</p>
                <p className="text-gray-400 text-xs">Confirmados</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                <p className="text-yellow-400 text-2xl font-bold">{partida.vagasDisponiveis}</p>
                <p className="text-gray-400 text-xs">Vagas abertas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-500" />Link de Convite
            </h2>
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-4 break-all">
              <p className="text-blue-400 text-sm font-mono">{linkConvite}</p>
            </div>
            <button onClick={copiarLink}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all ${
                copiado ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' :
                'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30'
              }`}>
              {copiado ? <><Check className="w-5 h-5" />Link Copiado!</> : <><Copy className="w-5 h-5" />Copiar Link</>}
            </button>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-blue-400 font-bold mb-3">Como funciona?</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2"><span className="text-blue-400">1.</span>Copie o link acima</li>
              <li className="flex items-start gap-2"><span className="text-blue-400">2.</span>Envie para seus amigos via WhatsApp ou redes sociais</li>
              <li className="flex items-start gap-2"><span className="text-blue-400">3.</span>Eles clicam no link e confirmam presença diretamente</li>
              <li className="flex items-start gap-2"><span className="text-blue-400">4.</span>Acompanhe as confirmações na aba "Detalhes"</li>
            </ul>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Código do convite:</p>
            <p className="text-green-400 font-mono font-bold text-lg">{partida.linkConvite}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
