import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { Home, Calendar, Users, Heart, User, Bell, Settings, Menu, LogOut, Trophy, Shield, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, validating } = useAuth()

  useEffect(() => {
    if (!validating && !user) navigate('/login')
  }, [user, validating])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/reserva', icon: Calendar, label: 'Reservar Quadra' },
    { path: '/jogos-publicos', icon: Users, label: 'Jogos Públicos' },
    { path: '/match', icon: Heart, label: 'Match de Jogadores' },
    { path: '/buscar-jogadores', icon: Search, label: 'Buscar Jogadores' },
    { path: '/minhas-reservas', icon: Trophy, label: 'Minhas Reservas' },
    { path: '/quadras-admin', icon: Shield, label: 'Gerenciar Quadras' },
    { path: '/perfil', icon: User, label: 'Perfil' },
    { path: '/notificacoes', icon: Bell, label: 'Notificações' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (validating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 z-50 h-screen w-72 bg-zinc-900 border-r border-zinc-800 shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">FuTinder</span>
            </div>
          </div>

          <div className="px-4 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              {user.foto ? (
                <img src={user.foto} className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-700" alt="" />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {user.nome?.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user.nome}</p>
                <p className="text-gray-500 text-xs truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-3">
            <ul className="space-y-0.5 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? 'bg-green-500/15 border border-green-500/20 text-white'
                          : 'hover:bg-zinc-800/60 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-green-400' : 'text-gray-500'}`} size={18} />
                      <span className={`text-sm ${isActive ? 'font-semibold text-white' : ''}`}>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-gray-500 w-full text-sm">
              <LogOut className="w-4 h-4" />
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-black/90 backdrop-blur border-b border-zinc-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">FuTinder</span>
          </div>
          <div className="ml-auto text-xs text-gray-600 hidden sm:block">{location.pathname.replace('/', '') || 'dashboard'}</div>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
