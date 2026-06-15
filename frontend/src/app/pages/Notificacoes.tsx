import { Bell, Calendar, Users, CheckCircle2, XCircle, UserPlus, Edit } from "lucide-react"

export default function Notificacoes() {
  const notificacoes = [
    { id: 1, tipo: "convite", titulo: "Novo convite recebido", mensagem: "Carlos Silva convidou você para 'Pelada do Sábado'", data: "Há 2 horas", lida: false, icon: Calendar, iconColor: "text-green-500", bgColor: "bg-green-500/20" },
    { id: 2, tipo: "confirmacao", titulo: "Presença confirmada", mensagem: "Pedro Oliveira confirmou presença em 'Racha da Galera'", data: "Há 4 horas", lida: false, icon: CheckCircle2, iconColor: "text-emerald-400", bgColor: "bg-emerald-500/20" },
    { id: 3, tipo: "novo_jogador", titulo: "Novo jogador inscrito", mensagem: "Lucas Costa se inscreveu em 'Futebol Society'", data: "Há 1 dia", lida: false, icon: UserPlus, iconColor: "text-green-400", bgColor: "bg-green-500/10" },
    { id: 4, tipo: "alteracao", titulo: "Partida alterada", mensagem: "Horário da partida 'Society Competitivo' foi alterado para 20:00", data: "Há 1 dia", lida: true, icon: Edit, iconColor: "text-zinc-300", bgColor: "bg-zinc-700" },
    { id: 5, tipo: "cancelamento", titulo: "Partida cancelada", mensagem: "A partida 'Pelada de Domingo' foi cancelada pelo organizador", data: "Há 2 dias", lida: true, icon: XCircle, iconColor: "text-red-400", bgColor: "bg-red-500/20" },
    { id: 6, tipo: "confirmacao", titulo: "Vaga preenchida", mensagem: "Todas as vagas da partida 'Racha Competitivo' foram preenchidas", data: "Há 2 dias", lida: true, icon: Users, iconColor: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  ]

  const naoLidas = notificacoes.filter(n => !n.lida).length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Bell className="w-8 h-8 text-green-500" />Notificações
        </h1>
        <p className="text-gray-400">Você tem <span className="text-green-400 font-semibold">{naoLidas}</span> notificação{naoLidas !== 1 ? 'ões' : ''} nova{naoLidas !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all">
            Marcar todas como lidas
          </button>
          <button className="flex-1 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all">
            Limpar notificações
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notificacoes.map(n => {
          const Icon = n.icon
          return (
            <div key={n.id} className={`bg-zinc-900 border rounded-xl p-5 transition-all ${
              n.lida ? 'border-zinc-800 hover:border-zinc-700' : 'border-green-500/20 bg-green-500/5 hover:border-green-500/30'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 ${n.bgColor} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${n.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1 gap-2">
                    <h3 className="text-white font-semibold text-sm">{n.titulo}</h3>
                    {!n.lida && <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0"></div>}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{n.mensagem}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-xs">{n.data}</span>
                    {n.tipo === "convite" ? (
                      <div className="flex gap-2">
                        <button className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 text-xs px-3 py-1.5 rounded-lg transition-all font-medium">Aceitar</button>
                        <button className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-gray-400 text-xs px-3 py-1.5 rounded-lg transition-all">Recusar</button>
                      </div>
                    ) : (
                      <button className="text-green-400 hover:text-green-300 text-xs transition-colors font-medium">Ver detalhes →</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 text-center">
        <button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-semibold px-8 py-3 rounded-xl transition-all text-sm">
          Carregar Mais Notificações
        </button>
      </div>
    </div>
  )
}
