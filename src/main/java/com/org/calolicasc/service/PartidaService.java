package com.org.calolicasc.service;

import com.org.calolicasc.model.*;
import com.org.calolicasc.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PartidaService {

    private final PartidaRepository partidaRepository;
    private final QuadraRepository quadraRepository;
    private final InscricaoRepository inscricaoRepository;
    private final AuthenticatedUserService authenticatedUserService;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy", new Locale("pt", "BR"));
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    public PartidaService(PartidaRepository partidaRepository, QuadraRepository quadraRepository,
                          InscricaoRepository inscricaoRepository,
                          AuthenticatedUserService authenticatedUserService) {
        this.partidaRepository = partidaRepository;
        this.quadraRepository = quadraRepository;
        this.inscricaoRepository = inscricaoRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public Map<String, Object> criarPartida(Long organizadorId, Long quadraId, String nome,
                                             String data, String horario, Integer vagasTotais, String nivel) {
        LocalDateTime dataHora = LocalDateTime.of(LocalDate.parse(data), LocalTime.parse(horario));

        if (partidaRepository.existsByQuadraIdAndDataHoraAndCanceladaFalse(quadraId, dataHora)) {
            throw new RuntimeException("Quadra já reservada neste horário");
        }

        Quadra quadra = quadraRepository.findById(quadraId)
            .orElseThrow(() -> new RuntimeException("Quadra não encontrada"));
        Usuario organizador = authenticatedUserService.requireAuthenticatedUser(organizadorId);

        Partida p = new Partida();
        p.setNome(nome);
        p.setQuadra(quadra);
        p.setOrganizador(organizador);
        p.setDataHora(dataHora);
        p.setPublica(false);
        p.setVagasTotais(vagasTotais);
        p.setVagasDisponiveis(vagasTotais - 1);
        p.setLinkConvite(UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        p.setNivel(nivel != null ? nivel : "Intermediário");
        p.setCancelada(false);
        p = partidaRepository.save(p);

        Inscricao insc = new Inscricao();
        insc.setPartida(p);
        insc.setUsuario(organizador);
        insc.setStatus("CONFIRMADO");
        insc.setDataResposta(LocalDateTime.now());
        inscricaoRepository.save(insc);

        return toResponse(p, organizadorId);
    }

    public List<Map<String, Object>> listarPublicas() {
        List<Partida> partidas = partidaRepository
            .findByPublicaTrueAndCanceladaFalseAndVagasDisponiveisGreaterThan(0);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Partida p : partidas) result.add(toResponse(p, null));
        return result;
    }

    public List<Map<String, Object>> listarMinhas(Long usuarioId) {
        Usuario usuario = authenticatedUserService.requireAuthenticatedUser(usuarioId);

        Set<Long> ids = new LinkedHashSet<>();
        List<Partida> comoOrganizador = partidaRepository.findByOrganizador(usuario);
        for (Partida p : comoOrganizador) ids.add(p.getId());

        List<Inscricao> inscricoes = inscricaoRepository.findByUsuarioId(usuarioId);
        for (Inscricao i : inscricoes) ids.add(i.getPartida().getId());

        List<Map<String, Object>> result = new ArrayList<>();
        for (Long id : ids) {
            partidaRepository.findById(id).ifPresent(p -> result.add(toResponse(p, usuarioId)));
        }
        result.sort((a, b) -> {
            String da = (String) a.get("dataHoraRaw");
            String db = (String) b.get("dataHoraRaw");
            if (da == null || db == null) return 0;
            return da.compareTo(db);
        });
        return result;
    }

    public Map<String, Object> getDetalhes(Long partidaId, Long usuarioId) {
        Partida p = partidaRepository.findById(partidaId)
            .orElseThrow(() -> new RuntimeException("Partida não encontrada"));

        if (usuarioId != null) {
            authenticatedUserService.requireAuthenticatedUser(usuarioId);
        }

        boolean podeVerJogadores = usuarioId != null &&
            (p.getOrganizador().getId().equals(usuarioId) ||
             inscricaoRepository.existsByPartidaIdAndUsuarioId(partidaId, usuarioId));

        Map<String, Object> resp = toResponse(p, usuarioId);

        if (podeVerJogadores) {
            List<Inscricao> inscricoes = inscricaoRepository.findByPartidaId(partidaId);
            List<Map<String, Object>> jogadores = new ArrayList<>();
            for (Inscricao i : inscricoes) {
                Map<String, Object> j = new LinkedHashMap<>();
                j.put("id", i.getUsuario().getId());
                j.put("nome", i.getUsuario().getNome());
                j.put("posicao", i.getUsuario().getPosicao());
                j.put("status", i.getStatus());
                j.put("dataResposta", i.getDataResposta() != null ?
                    i.getDataResposta().format(DateTimeFormatter.ofPattern("dd/MM HH:mm")) : null);
                jogadores.add(j);
            }
            resp.put("jogadores", jogadores);
            resp.put("confirmados", inscricoes.stream().filter(i -> "CONFIRMADO".equals(i.getStatus())).count());
            resp.put("pendentes", inscricoes.stream().filter(i -> "PENDENTE".equals(i.getStatus())).count());
            resp.put("recusados", inscricoes.stream().filter(i -> "RECUSADO".equals(i.getStatus())).count());
        }

        return resp;
    }

    public Map<String, Object> getByToken(String token) {
        Partida p = partidaRepository.findByLinkConvite(token)
            .orElseThrow(() -> new RuntimeException("Convite não encontrado"));
        return toResponse(p, null);
    }

    @Transactional
    public Map<String, Object> atualizarPartida(Long partidaId, Long organizadorId, Long quadraId,
                                                String nome, String data, String horario,
                                                Integer vagasTotais, String nivel) {
        Usuario usuarioAutenticado = authenticatedUserService.requireAuthenticatedUser(organizadorId);
        Partida p = partidaRepository.findById(partidaId)
            .orElseThrow(() -> new RuntimeException("Partida não encontrada"));

        if (!p.getOrganizador().getId().equals(usuarioAutenticado.getId())) {
            throw new RuntimeException("Apenas o organizador pode editar");
        }
        if (Boolean.TRUE.equals(p.getCancelada())) {
            throw new RuntimeException("Partida cancelada não pode ser editada");
        }
        if (nome == null || nome.isBlank()) {
            throw new RuntimeException("Nome da partida é obrigatório");
        }
        if (vagasTotais == null || vagasTotais < 2) {
            throw new RuntimeException("Informe pelo menos 2 vagas");
        }

        LocalDateTime dataHora = LocalDateTime.of(LocalDate.parse(data), LocalTime.parse(horario));
        if (partidaRepository.existsByQuadraIdAndDataHoraAndCanceladaFalseAndIdNot(quadraId, dataHora, partidaId)) {
            throw new RuntimeException("Quadra já reservada neste horário");
        }

        Quadra quadra = quadraRepository.findById(quadraId)
            .orElseThrow(() -> new RuntimeException("Quadra não encontrada"));

        int vagasPreenchidas = p.getVagasTotais() - p.getVagasDisponiveis();
        if (vagasTotais < vagasPreenchidas) {
            throw new RuntimeException("Total de vagas não pode ser menor que jogadores confirmados");
        }

        p.setNome(nome);
        p.setQuadra(quadra);
        p.setDataHora(dataHora);
        p.setVagasTotais(vagasTotais);
        p.setVagasDisponiveis(vagasTotais - vagasPreenchidas);
        p.setNivel(nivel != null && !nivel.isBlank() ? nivel : "Intermediário");
        p = partidaRepository.save(p);

        return toResponse(p, usuarioAutenticado.getId());
    }

    @Transactional
    public Map<String, Object> inscreverUsuario(Long partidaId, Long usuarioId) {
        Usuario usuario = authenticatedUserService.requireAuthenticatedUser(usuarioId);
        Partida p = partidaRepository.findById(partidaId)
            .orElseThrow(() -> new RuntimeException("Partida não encontrada"));

        if (Boolean.TRUE.equals(p.getCancelada()))
            throw new RuntimeException("Partida cancelada");
        if (p.getVagasDisponiveis() <= 0)
            throw new RuntimeException("Sem vagas disponíveis");
        if (inscricaoRepository.existsByPartidaIdAndUsuarioId(partidaId, usuarioId))
            throw new RuntimeException("Você já está inscrito nesta partida");

        p.setVagasDisponiveis(p.getVagasDisponiveis() - 1);
        partidaRepository.save(p);

        Inscricao insc = new Inscricao();
        insc.setPartida(p);
        insc.setUsuario(usuario);
        insc.setStatus("CONFIRMADO");
        insc.setDataResposta(LocalDateTime.now());
        inscricaoRepository.save(insc);

        return Map.of("ok", true, "mensagem", "Inscrição confirmada!");
    }

    @Transactional
    public Map<String, Object> sairDaPartida(Long partidaId, Long usuarioId) {
        Usuario usuarioAutenticado = authenticatedUserService.requireAuthenticatedUser(usuarioId);
        Partida p = partidaRepository.findById(partidaId)
            .orElseThrow(() -> new RuntimeException("Partida não encontrada"));
        if (p.getOrganizador().getId().equals(usuarioAutenticado.getId()))
            throw new RuntimeException("O organizador não pode sair da própria partida");
        if (p.getCancelada())
            throw new RuntimeException("A partida já foi cancelada");
        Inscricao inscricao = inscricaoRepository.findByPartidaIdAndUsuarioId(partidaId, usuarioId)
            .orElseThrow(() -> new RuntimeException("Você não está inscrito nesta partida"));
        inscricaoRepository.delete(inscricao);
        p.setVagasDisponiveis(p.getVagasDisponiveis() + 1);
        partidaRepository.save(p);
        return Map.of("ok", true, "mensagem", "Você saiu da partida com sucesso");
    }

    @Transactional
    public Map<String, Object> togglePublico(Long partidaId, Long usuarioId) {
        Usuario usuarioAutenticado = authenticatedUserService.requireAuthenticatedUser(usuarioId);
        Partida p = partidaRepository.findById(partidaId)
            .orElseThrow(() -> new RuntimeException("Partida não encontrada"));
        if (!p.getOrganizador().getId().equals(usuarioAutenticado.getId()))
            throw new RuntimeException("Apenas o organizador pode alterar a visibilidade");
        p.setPublica(!p.getPublica());
        partidaRepository.save(p);
        return Map.of("publica", p.getPublica());
    }

    @Transactional
    public Map<String, Object> cancelarPartida(Long partidaId, Long usuarioId) {
        Usuario usuarioAutenticado = authenticatedUserService.requireAuthenticatedUser(usuarioId);
        Partida p = partidaRepository.findById(partidaId)
            .orElseThrow(() -> new RuntimeException("Partida não encontrada"));
        if (!p.getOrganizador().getId().equals(usuarioAutenticado.getId()))
            throw new RuntimeException("Apenas o organizador pode cancelar");
        p.setCancelada(true);
        partidaRepository.save(p);
        return Map.of("ok", true);
    }

    private Map<String, Object> toResponse(Partida p, Long usuarioId) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", p.getId());
        m.put("nome", p.getNome());
        m.put("dataHoraRaw", p.getDataHora().toString());
        m.put("data", p.getDataHora().format(DATE_FMT));
        m.put("horario", p.getDataHora().format(TIME_FMT));
        m.put("quadraNome", p.getQuadra().getNome());
        m.put("quadraEndereco", p.getQuadra().getEndereco());
        m.put("quadraId", p.getQuadra().getId());
        m.put("quadraTipo", p.getQuadra().getTipo());
        m.put("quadraPreco", p.getQuadra().getPreco());
        m.put("quadraEmoji", p.getQuadra().getEmoji());
        m.put("organizadorNome", p.getOrganizador().getNome());
        m.put("organizadorId", p.getOrganizador().getId());
        m.put("publica", p.getPublica());
        m.put("vagasTotais", p.getVagasTotais());
        m.put("vagasDisponiveis", p.getVagasDisponiveis());
        m.put("vagasPreenchidas", p.getVagasTotais() - p.getVagasDisponiveis());
        m.put("linkConvite", p.getLinkConvite());
        m.put("nivel", p.getNivel());
        m.put("cancelada", p.getCancelada());
        String status = Boolean.TRUE.equals(p.getCancelada()) ? "Cancelada" :
            p.getVagasDisponiveis() == 0 ? "Lotada" : "Confirmada";
        m.put("status", status);
        if (usuarioId != null) {
            m.put("usuarioInscrito", inscricaoRepository.existsByPartidaIdAndUsuarioId(p.getId(), usuarioId));
            m.put("isOrganizador", p.getOrganizador().getId().equals(usuarioId));
        }
        return m;
    }
}
