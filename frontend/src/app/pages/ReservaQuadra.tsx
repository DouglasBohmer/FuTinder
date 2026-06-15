import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Calendar, Clock, MapPin, DollarSign, Users, Check, Trophy } from 'lucide-react'
import { api } from '../../services/api'

const HORARIOS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00']
const NIVEIS = ['Iniciante','Intermediário','Avançado']

export default function ReservaQuadra() {
  const navigate = useNavigate()
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [horario, setHorario] = useState('')
  const [quadraSel, setQuadraSel] = useState<number | null>(null)
  const [nome, setNome] = useState('')
  const [nivel, setNivel] = useState('Intermediário')
  const [vagasTotais, setVagasTotais] = useState(10)
  const [quadras, setQuadras] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (data && horario) {
      api.get(`/quadras/disponiveis?data=${data}&horario=${horario}`)
        .then(setQuadras).catch(console.error)
    } else {
      api.get('/quadras').then(setQuadras).catch(console.error)
    }
  }, [data, horario])

  const handleReservar = async (e: FormEvent) => {
    e.preventDefault()
    if (!quadraSel || !horario || !nome) { setErro('Preencha todos os campos'); return }
    setLoading(true); setErro('')
    try {
      const p = await api.post('/partidas', { nome, quadraId: quadraSel, data, horario, vagasTotais, nivel })
      navigate(`/partida/${p.id}`)
    } catch (err: any) {
      setErro(err.message)
    } finally { setLoading(false) }
  }

  const quadraSelecionada = quadras.find(q => q.id === quadraSel)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reservar Quadra</h1>
        <p className="text-gray-400">Escolha data, horário e local para sua partida</p>
      </div>

      <form onSubmit={handleReservar}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-green-500" />Nome da Partida
              </h2>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                placeholder="Ex: Pelada do Sábado" required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-500" />Selecione a Data
                </h2>
                <input type="date" value={data} onChange={e => setData(e.target.value)} min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-500" />Nível e Vagas
                </h2>
                <select value={nivel} onChange={e => setNivel(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all mb-3">
                  {NIVEIS.map(n => <option key={n}>{n}</option>)}
                </select>
                <input type="number" value={vagasTotais} onChange={e => setVagasTotais(Number(e.target.value))} min={2} max={22}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Total de vagas" />
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-500" />Selecione o Horário
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {HORARIOS.map(h => (
                  <button key={h} type="button" onClick={() => setHorario(h)}
                    className={`py-3 rounded-lg font-medium transition-all ${horario === h ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 border border-zinc-700'}`}>
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-red-500" />Quadras {horario ? 'Disponíveis' : 'Disponíveis'}
              </h2>
              <div className="space-y-4">
                {quadras.map(q => (
                  <div key={q.id} onClick={() => q.disponivel && setQuadraSel(q.id)}
                    className={`bg-zinc-800 rounded-lg p-5 border transition-all ${quadraSel === q.id ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-zinc-700 hover:border-zinc-600'} ${!q.disponivel ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{q.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white font-semibold mb-1">{q.nome}</h3>
                            <p className="text-gray-400 text-sm flex items-center gap-1"><MapPin className="w-4 h-4" />{q.endereco}</p>
                          </div>
                          {quadraSel === q.id && <div className="bg-green-500 text-white rounded-full p-1"><Check className="w-5 h-5" /></div>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <span>{q.tipo}</span>
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" />{q.capacidade} jogadores</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-400 flex items-center gap-1">
                            <DollarSign className="w-5 h-5" />R$ {q.preco?.toFixed(0)}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${q.disponivel ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {q.disponivel ? 'Disponível' : 'Indisponível'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-6">Resumo da Reserva</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div><p className="text-xs">Data</p>
                    <p className="text-white font-medium">{data ? new Date(data + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não selecionada'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div><p className="text-xs">Horário</p><p className="text-white font-medium">{horario || 'Não selecionado'}</p></div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <div><p className="text-xs">Quadra</p><p className="text-white font-medium">{quadraSelecionada?.nome || 'Não selecionada'}</p></div>
                </div>
                {quadraSelecionada && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <DollarSign className="w-5 h-5 text-yellow-500" />
                    <div><p className="text-xs">Valor Total</p><p className="text-white font-medium text-xl">R$ {quadraSelecionada.preco?.toFixed(0)}</p></div>
                  </div>
                )}
              </div>
              {erro && <p className="text-red-400 text-sm mb-4">{erro}</p>}
              <button type="submit" disabled={!data || !horario || !quadraSel || !nome || loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Confirmando...' : 'Confirmar Reserva'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">Você será redirecionado para os detalhes da partida</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
