import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { User, Mail, Lock, MapPin, Trophy, Target, Map } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCidades } from '../../hooks/useCidades'

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

const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"

export default function Cadastro() {
  const { updateUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', confirmSenha: '',
    cidade: '', estado: '', posicao: 'Atacante'
  })
  const [prefs, setPrefs] = useState({ campo: false, society: false, futsal: false })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const { cidades, loadingCidades } = useCidades(form.estado)

  const set = (k: string) => (e: any) => {
    setForm(f => {
      const next = { ...f, [k]: e.target.value }
      if (k === 'estado') next.cidade = ''
      return next
    })
  }
  const togglePref = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    if (form.senha !== form.confirmSenha) { setErro('As senhas não coincidem'); return }
    if (form.senha.length < 4) { setErro('A senha deve ter pelo menos 4 caracteres'); return }
    setLoading(true)
    const preferencias = Object.entries(prefs).filter(([, v]) => v).map(([k]) => k).join(',')
    try {
      const res = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome, email: form.email, senha: form.senha,
          cidade: form.cidade, estado: form.estado,
          posicao: form.posicao, preferencias
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Erro ao criar conta')
      updateUser(data)
      navigate('/')
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkboxClass = (active: boolean) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all select-none text-sm font-medium ${
      active
        ? 'bg-green-500/20 border-green-500/60 text-green-400'
        : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-500'
    }`

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-zinc-900 rounded-2xl p-8 md:p-12 border border-zinc-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">FuTinder</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 text-center">Criar nova conta</h1>
          <p className="text-gray-400 mb-8 text-center">Junte-se à nossa comunidade de jogadores</p>

          {erro && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{erro}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="text" value={form.nome} onChange={set('nome')} placeholder="João Silva" required className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="email" value={form.email} onChange={set('email')} placeholder="seu@email.com" required className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="password" value={form.senha} onChange={set('senha')} placeholder="••••••••" required className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="password" value={form.confirmSenha} onChange={set('confirmSenha')} placeholder="••••••••" required className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select value={form.estado} onChange={set('estado')}
                    className={`${inputClass} appearance-none`}>
                    <option value="">Selecione o estado...</option>
                    {ESTADOS.map(e => <option key={e.uf} value={e.uf}>{e.uf} — {e.nome}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cidade {loadingCidades && <span className="text-gray-500 text-xs ml-1">carregando...</span>}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  {cidades.length > 0 ? (
                    <select value={form.cidade} onChange={set('cidade')}
                      className={`${inputClass} appearance-none`}>
                      <option value="">Selecione a cidade...</option>
                      {cidades.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text" value={form.cidade} onChange={set('cidade')}
                      placeholder={form.estado ? 'Carregando cidades...' : 'Selecione o estado primeiro'}
                      disabled={!!form.estado && loadingCidades}
                      className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Posição Favorita</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select value={form.posicao} onChange={set('posicao')}
                    className={`${inputClass} appearance-none`}>
                    {['Goleiro','Zagueiro','Lateral','Volante','Meia','Atacante'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
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

            <button type="submit" disabled={loading}
              className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 text-center mt-6 disabled:opacity-50">
              {loading ? 'Criando conta...' : 'Criar Conta e Entrar'}
            </button>

            <div className="text-center pt-2">
              <span className="text-gray-400">Já tem uma conta? </span>
              <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">Entrar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
