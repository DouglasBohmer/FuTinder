import { getCurrentUser } from '../context/AuthContext'

const BASE = '/api'

function headers(): Record<string, string> {
  const user = getCurrentUser()
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (user?.id) h['X-User-Id'] = String(user.id)
  return h
}

async function handle(res: Response) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.erro || 'Erro na requisição')
  return data
}

export const api = {
  get: (path: string) => fetch(`${BASE}${path}`, { headers: headers() }).then(handle),
  post: (path: string, body?: unknown) => fetch(`${BASE}${path}`, {
    method: 'POST', headers: headers(), body: JSON.stringify(body)
  }).then(handle),
  put: (path: string, body?: unknown) => fetch(`${BASE}${path}`, {
    method: 'PUT', headers: headers(), body: body ? JSON.stringify(body) : undefined
  }).then(handle),
  delete: (path: string) => fetch(`${BASE}${path}`, {
    method: 'DELETE', headers: headers()
  }).then(handle),
}
