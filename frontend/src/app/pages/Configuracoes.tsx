import { useState, FormEvent } from 'react'
import { User, Lock, Bell, Shield, Smartphone, Save, KeyRound, Camera } from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useCidades } from '../../hooks/useCidades'
import FotoCropper from '../components/FotoCropper'

const ESTADOS = [
  { uf: 'AC', nome: 'Acre' }, { uf: 'AL', nome: 'Alagoas' }, { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' }, { uf: 'BA', nome: 'Bahia' }, { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' }, { uf: 'ES', nome: 'Espírito Santo' },
  { uf: 'GO', nome: 'Goiás' }, { uf: 'MA', nome: 'Maranhão' }, { uf: 'MT', nome: 'Mato Grosso' },
  { uf: 'MS', nome: 'Mato Grosso do Sul' }, { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'PA', nome: 'Pará' }, { uf: 'PB', nome: 'Paraíba' }, { uf: 'PR', nome: 'Paraná' },
  { uf: 'PE', nome: 'Pernambuco' }, { uf: 'PI', nome: 'Piauí' }, { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'RN', nome: 'Rio Grande do Norte' }, { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'RO', nome: 'Rondônia' }, { uf: 'RR', nome: 'Roraima' }, { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'SP', nome: 'São Paulo' }, { uf: 'SE', nome: 'Sergipe' }, { uf: 'TO', nome: 'Tocantins' },
]

const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"

function parsePrefs(str?: string) {
  const p = str?.split(',') || []
  return { campo: p.includes('campo'), society: p.includes('society'), futsal: p.includes('futsal') }
}

export default function Configuracoes() {
  const { user, updateUser } = useAuth()

  const [showCropper, setShowCropper] = useState(false)
  const [foto, setFoto] = useState(user?.foto || '')
  const [msgFoto, setMsgFoto] = useState('')

  const [nome, setNome] = useState(user?.nome || '')
  const [estado, setEstado] = useState(user?.estado || '')
  const [cidade, setCidade] = useState(user?.cidade || '')
  const [posicao, setPosicao] = useState(user?.posicao || 'Atacante')
  const [prefs, setPrefs] = useState(() => parsePrefs(user?.preferencias))
  const [msgPerfil, setMsgPerfil] = useState('')
  const [savingPerfil, setSavingPerfil] = useState(false)

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [msgSenha, setMsgSenha] = useState('')
  const [savingSenha, setSavingSenha] = useState(false)

  const { cidades, loadingCidades } = useCidades(estado)

  const handleEstadoChange = (uf: string) => {
    setEstado(uf)
    setCidade('')
  }

  const togglePref = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }))

  const handleFotoSave = async (base64: string) => {
    setMsgFoto('')
    try {
      const data = await api.put('/usuarios/foto', { foto: base64 }) as any
      updateUser(data)
      setFoto(data.foto)
      setShowCropper(false)
      setMsgFoto('Foto atualizada com sucesso!')
    } catch (e: any) {
      setMsgFoto(e.message)
    }
  }

  const salvarPerfil = async (e: FormEvent) => {
    e.preventDefault()
    setSavingPerfil(true); setMsgPerfil('')
    const preferencias = Object.entries(prefs).filter(([, v]) => v).map(([k]) => k).join(',')
    try {
      const data = await api.put('/usuarios/perfil', { nome, cidade, estado, posicao, preferencias })
      updateUser(data as any)
      setMsgPerfil('Perfil salvo com sucesso!')
    } catch (e: any) { setMsgPerfil(e.message) }
    finally { setSavingPerfil(false) }
  }

  const alterarSenha = async (e: FormEvent) => {
    e.preventDefault()
    setMsgSenha('')
    if (novaSenha !== confirmarSenha) { setMsgSenha('As senhas não coincidem'); return }
    if (novaSenha.length < 4) { setMsgSenha('A nova senha deve ter ao menos 4 caracteres'); return }
    setSavingSenha(true)
    try {
      await api.put('/usuarios/senha', { senhaAtual, novaSenha })
      setMsgSenha('Senha alterada com sucesso!')
      setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('')
    } catch (e: any) { setMsgSenha(e.message) }
    finally { setSavingSenha(false) }
  }

  const checkboxClass = (active: boolean) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all select-none text-sm font-medium ${
      active ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-500'
    }`

  const Toggle = ({ defaultChecked }: { defaultChecked?: boolean }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
    </label>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {showCropper && (
        <FotoCropper
          currentSrc={foto || null}
          onSave={handleFotoSave}
          onCancel={() => setShowCropper(false)}
        />
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-gray-400">Gerencie suas preferências e dados de conta</p>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-green-500" />Dados Pessoais
          </h2>

          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-zinc-800">
            <div className="relative shrink-0">
              {foto ? (
                <img src={foto} className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700" alt="Foto de perfil" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold text-white border-2 border-zinc-700">
                  {user?.nome?.charAt(0)}
                </div>
              )}
              <button type="button" onClick={() => setShowCropper(true)}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-zinc-800 border border-zinc-600 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors">
                <Camera className="w-3.5 h-3.5 text-green-400" />
              </button>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">{user?.nome}</p>
              <button type="button" onClick={() => setShowCropper(true)}
                className="text-sm text-green-400 hover:text-green-300 transition-colors flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                {foto ? 'Trocar foto' : 'Adicionar foto'}
              </button>
              {msgFoto && (
                <p className={`text-xs mt-1 ${msgFoto.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>{msgFoto}</p>
              )}
            </div>
          </div>

          <form onSubmit={salvarPerfil} className="space-y-4">
            {msgPerfil && (
              <div className={`px-4 py-3 rounded-xl text-sm border ${msgPerfil.includes('sucesso') ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                {msgPerfil}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
                <input type="email" defaultValue={user?.email} readOnly
                  className="w-full bg-zinc-800/40 border border-zinc-700 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                <select value={estado} onChange={e => handleEstadoChange(e.target.value)}
                  className={`${inputClass} appearance-none`}>
                  <option value="">Selecione o estado...</option>
                  {ESTADOS.map(e => <option key={e.uf} value={e.uf}>{e.uf} — {e.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cidade {loadingCidades && <span className="text-gray-500 text-xs ml-1">carregando...</span>}
                </label>
                {cidades.length > 0 ? (
                  <select value={cidade} onChange={e => setCidade(e.target.value)}
                    className={`${inputClass} appearance-none`}>
                    <option value="">Selecione a cidade...</option>
                    {cidades.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input type="text" value={cidade} onChange={e => setCidade(e.target.value)}
                    placeholder={estado ? 'Carregando...' : 'Selecione o estado primeiro'}
                    disabled={!!estado && loadingCidades}
                    className={`${inputClass} disabled:opacity-50`} />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Posição Favorita</label>
              <select value={posicao} onChange={e => setPosicao(e.target.value)}
                className={`${inputClass} appearance-none`}>
                {['Goleiro','Zagueiro','Lateral','Volante','Meia','Atacante'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Preferências de Jogo</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { key: 'campo' as const, emoji: '🏟️', label: 'Campo' },
                  { key: 'society' as const, emoji: '⚽', label: 'Society' },
                  { key: 'futsal' as const, emoji: '🏃', label: 'Futsal' },
                ].map(({ key, emoji, label }) => (
                  <label key={key} className={checkboxClass(prefs[key])}>
                    <input type="checkbox" className="hidden" checked={prefs[key]} onChange={() => togglePref(key)} />
                    <span>{emoji}</span> {label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={savingPerfil}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-50">
              <Save className="w-4 h-4" />
              {savingPerfil ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-zinc-400" />Alterar Senha
          </h2>
          <form onSubmit={alterarSenha} className="space-y-4">
            {msgSenha && (
              <div className={`px-4 py-3 rounded-xl text-sm border ${msgSenha.includes('sucesso') ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                {msgSenha}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Senha Atual</label>
              <input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)}
                placeholder="••••••••" required className={inputClass} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nova Senha</label>
                <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)}
                  placeholder="••••••••" required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Nova Senha</label>
                <input type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)}
                  placeholder="••••••••" required className={inputClass} />
              </div>
            </div>
            <button type="submit" disabled={savingSenha}
              className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50">
              {savingSenha ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </form>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6 text-green-500" />Preferências de Notificação
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Convites de Partida', desc: 'Receba notificações de novos convites', checked: true },
              { label: 'Confirmações de Presença', desc: 'Quando alguém confirmar presença em sua partida', checked: true },
              { label: 'Novos Jogos Públicos', desc: 'Notificações de novas partidas próximas', checked: false },
              { label: 'Alterações na Partida', desc: 'Mudanças em partidas que você confirmou', checked: true },
            ].map(({ label, desc, checked }) => (
              <div key={label} className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                <div><p className="text-white font-medium">{label}</p><p className="text-gray-500 text-sm">{desc}</p></div>
                <Toggle defaultChecked={checked} />
              </div>
            ))}
            <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl border border-zinc-700">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-green-400" />
                <div><p className="text-white font-medium">Notificações Push</p><p className="text-gray-500 text-sm">Notificações no dispositivo móvel</p></div>
              </div>
              <Toggle defaultChecked />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-zinc-400" />Privacidade
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Perfil Público', desc: 'Outros jogadores podem ver seu perfil', checked: true },
              { label: 'Mostrar Estatísticas', desc: 'Exibir suas estatísticas publicamente', checked: true },
              { label: 'Compartilhar Localização', desc: 'Mostrar sua cidade nas buscas', checked: true },
            ].map(({ label, desc, checked }) => (
              <div key={label} className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                <div><p className="text-white font-medium">{label}</p><p className="text-gray-500 text-sm">{desc}</p></div>
                <Toggle defaultChecked={checked} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
          <h2 className="text-lg font-bold text-red-400 mb-2">Zona de Perigo</h2>
          <p className="text-gray-500 text-sm mb-4">Esta ação é irreversível e apagará todos os seus dados</p>
          <button className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold py-2.5 px-6 rounded-xl transition-all">
            Excluir Conta
          </button>
        </div>
      </div>
    </div>
  )
}
