import { useEffect, useState } from 'react'
import { MapPin, Users, Calendar, Heart, X, ChevronLeft, Clock } from 'lucide-react'
import { api } from '../../services/api'

export default function MatchJogadores() {
  const [jogos, setJogos] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<'like' | 'skip' | null>(null)
  const [inscrito, setInscrito] = useState(false)
  const [erro, setErro] = useState('')
  const [historico, setHistorico] = useState<any[]>([])

  useEffect(() => {
    api.get('/partidas/publicas')
      .then(setJogos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const jogo = jogos[index]

  const handleLike = async () => {
    if (!jogo) return
    setFeedback('like')
    try {
      await api.post(`/partidas/${jogo.id}/inscrever`)
      setInscrito(true)
      setHistorico(h => [{ ...jogo, acao: 'like' }, ...h])
    } catch (e: any) { setErro(e.message) }
    setTimeout(() => { setFeedback(null); setInscrito(false); setErro(''); setIndex(i => i + 1) }, 1500)
  }

  const handleSkip = () => {
    setFeedback('skip')
    setHistorico(h => [{ ...jogo, acao: 'skip' }, ...h])
    setTimeout(() => { setFeedback(null); setIndex(i => i + 1) }, 500)
  }

  const voltar = () => {
    if (index > 0) { setIndex(i => i - 1); setHistorico(h => h.slice(1)) }
  }

  const getNivelColor = (nivel: string) => {
    if (nivel === 'Iniciante') return 'text-green-400 bg-green-500/20 border-green-500/30'
    if (nivel === 'Avançado') return 'text-zinc-300 bg-zinc-700 border-zinc-600'
    return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Heart className="w-8 h-8 text-green-500" />Match de Jogadores
        </h1>
        <p className="text-gray-400">Deslize para encontrar a partida perfeita</p>
      </div>

      {!jogo ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Acabaram as partidas!</h2>
          <p className="text-gray-400 mb-6">Não há mais jogos disponíveis no momento</p>
          <button onClick={() => { setIndex(0); setHistorico([]) }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30">
            Ver novamente
          </button>
        </div>
      ) : (
        <>
          <div className={`relative bg-zinc-900 border rounded-2xl p-8 mb-6 transition-all duration-300 ${
            feedback === 'like' ? 'border-green-500 shadow-2xl shadow-green-500/20' :
            feedback === 'skip' ? 'border-red-500/50' : 'border-zinc-800'
          }`}>
            {feedback === 'like' && (
              <div className="absolute top-6 right-6 bg-green-500 text-white rounded-full px-4 py-2 font-bold text-lg rotate-12">
                ENTRAR! ✓
              </div>
            )}
            {feedback === 'skip' && (
              <div className="absolute top-6 left-6 bg-zinc-700 text-white rounded-full px-4 py-2 font-bold text-lg -rotate-12">
                PASSAR ✗
              </div>
            )}

            <div className="text-6xl mb-4">{jogo.quadraEmoji || '⚽'}</div>
            <h2 className="text-3xl font-bold text-white mb-2">{jogo.nome}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getNivelColor(jogo.nivel)} mb-6`}>{jogo.nivel}</span>

            <div className="space-y-3 mb-6">
              {[
                { icon: MapPin, val: jogo.quadraNome, sub: jogo.quadraEndereco },
                { icon: Calendar, val: jogo.data },
                { icon: Clock, val: jogo.horario },
                { icon: Users, val: `${jogo.vagasDisponiveis} vagas de ${jogo.vagasTotais}` },
              ].map(({ icon: Icon, val, sub }: any) => (
                <div key={val} className="flex items-center gap-3 bg-zinc-800 rounded-xl px-4 py-3 border border-zinc-700">
                  <Icon className="w-4 h-4 text-green-500 shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm">{val}</p>
                    {sub && <p className="text-gray-500 text-xs">{sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                style={{ width: `${(jogo.vagasPreenchidas / jogo.vagasTotais) * 100}%` }}></div>
            </div>
            {erro && <p className="text-red-400 text-sm mt-4">{erro}</p>}
            {inscrito && <p className="text-green-400 text-sm mt-4 font-medium">Inscrição confirmada! ✓</p>}
          </div>

          <div className="flex items-center justify-center gap-8 mb-6">
            <button onClick={voltar} disabled={index === 0}
              className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-all disabled:opacity-30">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={handleSkip}
              className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-red-500/50 flex items-center justify-center hover:bg-red-500/10 transition-all">
              <X className="w-7 h-7 text-red-400" />
            </button>
            <button onClick={handleLike}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30">
              <Heart className="w-7 h-7 text-white" />
            </button>
          </div>

          <div className="text-center text-gray-500 text-sm">
            {index + 1} de {jogos.length} partidas disponíveis
          </div>
        </>
      )}
    </div>
  )
}
