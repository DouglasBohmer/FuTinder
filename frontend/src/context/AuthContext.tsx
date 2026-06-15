import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: number
  nome: string
  email: string
  cidade?: string
  posicao?: string
  estado?: string
  preferencias?: string
  foto?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
  updateUser: (u: User) => void
  loading: boolean
  validating: boolean
}

const AuthContext = createContext<AuthContextType>(null!)

const USER_KEY = 'futinder_user'

export function getCurrentUser(): User | null {
  const s = localStorage.getItem(USER_KEY)
  if (!s) return null
  try { return JSON.parse(s) } catch { return null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    const stored = getCurrentUser()
    if (!stored) { setValidating(false); return }

    fetch('/api/usuarios/perfil', {
      headers: { 'X-User-Id': String(stored.id), 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (res.ok) {
          setUser(stored)
        } else {
          localStorage.removeItem(USER_KEY)
        }
      })
      .catch(() => {
        localStorage.removeItem(USER_KEY)
      })
      .finally(() => setValidating(false))
  }, [])

  const login = async (email: string, senha: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Erro ao fazer login')
      localStorage.setItem(USER_KEY, JSON.stringify(data))
      setUser(data)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const updateUser = (u: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, validating }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
