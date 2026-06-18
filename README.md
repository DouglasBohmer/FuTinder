# FuTinder ⚽

## Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [O Problema que Resolve](#o-problema-que-resolve)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Integrantes e RAs](#integrantes-e-ras)
- [Entidades e Relacionamentos](#entidades-e-relacionamentos)
- [Roteiro das Telas](#roteiro-das-telas)
- [Pré-requisitos](#pré-requisitos)
- [Como Executar](#como-executar)
- [URLs do Sistema](#urls-do-sistema)
- [Credenciais Padrão](#credenciais-padrão)
- [Exemplos de Uso dos CRUDs](#exemplos-de-uso-dos-cruds)
- [Observabilidade](#observabilidade)

## Sobre o Projeto
O FuTinder é uma aplicação web desenvolvida como um projeto acadêmico prático de Programação Web. A plataforma atua como um facilitador na gestão esportiva amadora, conectando jogadores e espaços físicos (quadras) de forma centralizada, inteligente e rápida, com foco em uma arquitetura back-end robusta utilizando Spring Boot.

## O Problema que Resolve
Organizar uma partida de futebol amador frequentemente esbarra em dores conhecidas: a dificuldade de encontrar horários livres nas quadras, a confusão para confirmar quem realmente vai jogar e, principalmente, a frustração de ter desistências de última hora que inviabilizam o jogo por falta de atletas.

O aplicativo resolve esses gargalos operacionais entregando três frentes principais:
* **Agendamento Transparente:** Centraliza o calendário das quadras, permitindo visualizar a disponibilidade em tempo real e efetuar a reserva sem atritos.
* **Gestão de Presença (RSVP):** Elimina o caos dos grupos de mensagens ao gerar um link exclusivo de convite para cada partida, onde os jogadores apenas confirmam se vão ou não.
* **Matchmaking de Vagas:** Permite que o organizador torne a partida "Pública". Dessa forma, se faltarem 2 pessoas para fechar o time, a partida aparece em um mural global onde jogadores avulsos podem se inscrever para preencher essas vagas restantes.

## Tecnologias Utilizadas
* Java
* Spring Boot (Spring Web, Spring Data JPA)
* Banco de Dados Relacional

## Integrantes e RAs

| Integrante | RA |
| --- | --- |
| Douglas Eduardo Schuller Bohmer - 1327412
| Lucas Dias - 
| Gabriel Sordi - 1326966
| Igor Sebastian - 1326849

## Entidades e Relacionamentos

O sistema trabalha com quatro entidades principais:

| Entidade | Responsabilidade |
| --- | --- |
| Usuario | Representa jogadores e organizadores, com dados de perfil, cidade, posição, preferências, foto e senha criptografada. |
| Quadra | Representa os espaços esportivos disponíveis para reserva, incluindo nome, endereço, tipo, capacidade, preço e ícone. |
| Partida | Representa uma reserva/jogo criado por um usuário organizador em uma quadra, com data, horário, vagas, nível, link de convite e status de cancelamento. |
| Inscricao | Representa a participação de um usuário em uma partida, com status de confirmação e data de resposta. |

Relacionamentos principais:

- Uma `Partida` pertence a uma `Quadra`.
- Uma `Partida` possui um `Usuario` organizador.
- Uma `Partida` possui várias `Inscricao`.
- Uma `Inscricao` liga um `Usuario` a uma `Partida`.
- O organizador também é registrado como inscrito confirmado ao criar a partida.

## Roteiro das Telas

| Tela | Rota | Função |
| --- | --- | --- |
| Login | `/login` | Autentica o usuário. |
| Cadastro | `/cadastro` | Cria uma nova conta. |
| Dashboard | `/` | Mostra resumo de partidas e atalhos principais. |
| Reserva de Quadra | `/reserva` | Cria uma partida selecionando data, horário, quadra, vagas e nível. |
| Detalhes da Partida | `/partida/:id` | Exibe detalhes, jogadores, edição, publicação, inscrição, saída e cancelamento. |
| Convite da Partida | `/partida/:id/convite` | Exibe o link público de convite da partida. |
| Resposta ao Convite | `/convite/:token` | Permite visualizar e confirmar presença por token de convite. |
| Jogos Públicos | `/jogos-publicos` | Lista partidas públicas disponíveis. |
| Match de Jogadores | `/match` | Navega por partidas públicas em formato de descoberta. |
| Minhas Reservas | `/minhas-reservas` | Lista partidas criadas ou inscritas pelo usuário. |
| Gerenciar Quadras | `/quadras-admin` | CRUD de quadras. |
| Perfil | `/perfil` | Exibe dados do usuário. |
| Configurações | `/configuracoes` | Atualiza perfil, foto, senha e preferências visuais. |
| Buscar Jogadores | `/buscar-jogadores` | Filtra jogadores por nome, posição e cidade. |
| Notificações | `/notificacoes` | Exibe notificações simuladas da aplicação. |

## Pré-requisitos

- Java 17 ou superior.
- Node.js e npm.
- Docker Desktop, opcional, para Prometheus e Grafana.
- PowerShell no Windows.

O projeto inclui Maven Wrapper (`mvnw.cmd`), então não é necessário instalar Maven globalmente.

## Como Executar

### Desenvolvimento com frontend separado

Em um terminal, suba o backend:

```powershell
.\mvnw.cmd spring-boot:run
```

Em outro terminal, suba o frontend Vite:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Use o frontend em desenvolvimento em:

```text
http://localhost:5000
```

### Build único para entrega

Na raiz do projeto:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1
```

Esse script instala/builda o frontend, copia o React gerado para `src/main/resources/static`, executa os testes do backend e gera o `.jar`.

Para reutilizar `frontend/node_modules` já instalado:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 -SkipInstall
```

Depois do build, execute:

```powershell
java -jar .\target\FuTinder-0.0.1-SNAPSHOT.jar
```

## URLs do Sistema

| URL | Uso |
| --- | --- |
| `http://localhost:5000` | Frontend em desenvolvimento com Vite. |
| `http://localhost:8080` | Backend Spring Boot e frontend empacotado. |
| `http://localhost:8080/swagger-ui.html` | Documentação Swagger/OpenAPI. |
| `http://localhost:8080/actuator/health` | Saúde da aplicação. |
| `http://localhost:8080/actuator/prometheus` | Métricas Prometheus. |
| `http://localhost:9090` | Prometheus via Docker Compose. |
| `http://localhost:3000` | Grafana via Docker Compose. |

## Credenciais Padrão

Usuário inicial criado automaticamente quando o banco está vazio:

| Campo | Valor |
| --- | --- |
| Login | `admin` |
| Senha | `admin` |

As senhas são armazenadas com BCrypt. Usuários antigos com senha em texto puro são migrados automaticamente para BCrypt no primeiro login bem-sucedido.

## Exemplos de Uso dos CRUDs

Os exemplos abaixo usam `curl`. Em operações protegidas, envie o header `X-User-Id` com o ID do usuário autenticado.

### CRUD de Quadras

Criar quadra:

```bash
curl -X POST http://localhost:8080/api/quadras \
  -H "Content-Type: application/json" \
  -d '{"nome":"Arena Norte","endereco":"Rua Um, 100","tipo":"Society","capacidade":10,"preco":180.0,"emoji":"⚽"}'
```

Listar quadras:

```bash
curl http://localhost:8080/api/quadras
```

Atualizar quadra:

```bash
curl -X PUT http://localhost:8080/api/quadras/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Arena Norte Editada","endereco":"Rua Um, 100","tipo":"Futsal","capacidade":12,"preco":200.0,"emoji":"🏟️"}'
```

Remover quadra:

```bash
curl -X DELETE http://localhost:8080/api/quadras/1
```

### CRUD de Partidas

Criar partida:

```bash
curl -X POST http://localhost:8080/api/partidas \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{"quadraId":1,"nome":"Pelada de Sexta","data":"2099-12-20","horario":"20:00","vagasTotais":10,"nivel":"Intermediário"}'
```

Listar minhas partidas:

```bash
curl http://localhost:8080/api/partidas/minhas \
  -H "X-User-Id: 1"
```

Atualizar partida:

```bash
curl -X PUT http://localhost:8080/api/partidas/1 \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{"quadraId":1,"nome":"Pelada Atualizada","data":"2099-12-21","horario":"21:00","vagasTotais":12,"nivel":"Avançado"}'
```

Cancelar partida:

```bash
curl -X DELETE http://localhost:8080/api/partidas/1 \
  -H "X-User-Id: 1"
```

## Observabilidade

Com o backend rodando em `8080`, suba Prometheus e Grafana:

```powershell
docker compose up
```

O Prometheus coleta métricas de:

```text
http://host.docker.internal:8080/actuator/prometheus
```

O Grafana é provisionado automaticamente com datasource Prometheus e dashboard do FuTinder.

Credenciais do Grafana:

| Campo | Valor |
| --- | --- |
| Usuário | `admin` |
| Senha | `admin` |
