import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { Mail, Lock, Trophy } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    try {
      await login(email, senha)
      navigate('/')
    } catch (err: any) {
      setErro(err.message || 'Erro ao fazer login')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-zinc-900 rounded-2xl p-8 md:p-12 border border-zinc-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">FuTinder</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-400 mb-8">Entre para organizar suas partidas</p>

          {erro && <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{erro}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">E-mail ou usuário</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="text" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com" required autoComplete="username"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>
            </div>

            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-xs text-gray-400">
              Demo: <span className="text-green-400">admin</span> / <span className="text-green-400">admin</span>
            </div>

            <button type="submit" disabled={loading}
              className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 text-center disabled:opacity-50">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="text-center pt-4">
              <span className="text-gray-400">Não tem uma conta? </span>
              <Link to="/cadastro" className="text-green-400 hover:text-green-300 font-semibold transition-colors">Criar conta</Link>
            </div>
          </form>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center text-center">
          <div className="w-64 h-64 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-full animate-pulse"></div>
            <Trophy className="w-32 h-32 text-green-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Organize suas partidas</h2>
          <p className="text-xl text-gray-400 max-w-md">Reserve quadras, convide amigos e encontre jogadores para completar seus times</p>
        </div>
      </div>
    </div>
  )
}
