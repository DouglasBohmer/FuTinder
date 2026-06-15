import { createBrowserRouter } from 'react-router'
import { Layout } from './components/Layout'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import ReservaQuadra from './pages/ReservaQuadra'
import DetalhesPartida from './pages/DetalhesPartida'
import JogosPublicos from './pages/JogosPublicos'
import ConviteLink from './pages/ConviteLink'
import MinhasReservas from './pages/MinhasReservas'
import Perfil from './pages/Perfil'
import MatchJogadores from './pages/MatchJogadores'
import Notificacoes from './pages/Notificacoes'
import Configuracoes from './pages/Configuracoes'
import RespostaConvite from './pages/RespostaConvite'
import GerenciarQuadras from './pages/GerenciarQuadras'
import BuscarJogadores from './pages/BuscarJogadores'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/cadastro', element: <Cadastro /> },
  { path: '/convite/:token', element: <RespostaConvite /> },
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/reserva', element: <ReservaQuadra /> },
      { path: '/partida/:id', element: <DetalhesPartida /> },
      { path: '/partida/:id/convite', element: <ConviteLink /> },
      { path: '/jogos-publicos', element: <JogosPublicos /> },
      { path: '/match', element: <MatchJogadores /> },
      { path: '/minhas-reservas', element: <MinhasReservas /> },
      { path: '/quadras-admin', element: <GerenciarQuadras /> },
      { path: '/perfil', element: <Perfil /> },
      { path: '/notificacoes', element: <Notificacoes /> },
      { path: '/configuracoes', element: <Configuracoes /> },
      { path: '/buscar-jogadores', element: <BuscarJogadores /> },
    ]
  }
])
