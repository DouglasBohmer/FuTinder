package com.org.calolicasc.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.org.calolicasc.model.Quadra;
import com.org.calolicasc.model.Usuario;
import com.org.calolicasc.repository.InscricaoRepository;
import com.org.calolicasc.repository.PartidaRepository;
import com.org.calolicasc.repository.QuadraRepository;
import com.org.calolicasc.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PartidaControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private InscricaoRepository inscricaoRepository;
    @Autowired private PartidaRepository partidaRepository;
    @Autowired private QuadraRepository quadraRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    private Usuario organizador;
    private Usuario jogador;
    private Quadra quadraPrincipal;
    private Quadra quadraAlternativa;
    private String amanha;
    private String depoisDeAmanha;

    @BeforeEach
    void setUp() {
        inscricaoRepository.deleteAll();
        partidaRepository.deleteAll();
        quadraRepository.deleteAll();
        usuarioRepository.deleteAll();

        organizador = criarUsuario("Organizador", "organizador.api@email.com");
        jogador = criarUsuario("Jogador", "jogador.api@email.com");
        quadraPrincipal = criarQuadra("Quadra API Principal");
        quadraAlternativa = criarQuadra("Quadra API Alternativa");
        amanha = LocalDate.now().plusDays(1).toString();
        depoisDeAmanha = LocalDate.now().plusDays(2).toString();
    }

    @Test
    void deveExecutarFluxoPrincipalDePartidaPelaApi() throws Exception {
        Long partidaId = criarPartida("Pelada API", quadraPrincipal.getId(), amanha, "10:00", 6);

        mockMvc.perform(get("/api/partidas/{id}", partidaId)
                .header("X-User-Id", organizador.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nome").value("Pelada API"))
            .andExpect(jsonPath("$.isOrganizador").value(true))
            .andExpect(jsonPath("$.jogadores", hasSize(1)));

        mockMvc.perform(put("/api/partidas/{id}", partidaId)
                .header("X-User-Id", organizador.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(partidaPayload(
                    "Pelada API Editada", quadraAlternativa.getId(), depoisDeAmanha, "12:00", 8
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nome").value("Pelada API Editada"))
            .andExpect(jsonPath("$.quadraId").value(quadraAlternativa.getId()))
            .andExpect(jsonPath("$.vagasTotais").value(8));

        mockMvc.perform(post("/api/partidas/{id}/inscrever", partidaId)
                .header("X-User-Id", jogador.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ok").value(true));

        mockMvc.perform(put("/api/partidas/{id}/toggle-publico", partidaId)
                .header("X-User-Id", organizador.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.publica").value(true));

        mockMvc.perform(get("/api/partidas/publicas"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].id").value(partidaId));

        mockMvc.perform(delete("/api/partidas/{id}/sair", partidaId)
                .header("X-User-Id", jogador.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ok").value(true));

        mockMvc.perform(delete("/api/partidas/{id}", partidaId)
                .header("X-User-Id", organizador.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ok").value(true));

        mockMvc.perform(get("/api/partidas/{id}", partidaId)
                .header("X-User-Id", organizador.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.cancelada").value(true))
            .andExpect(jsonPath("$.status").value("Cancelada"));
    }

    @Test
    void deveValidarPayloadDePartida() throws Exception {
        mockMvc.perform(post("/api/partidas")
                .header("X-User-Id", organizador.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "quadraId", quadraPrincipal.getId(),
                    "nome", "",
                    "data", LocalDate.now().minusDays(1).toString(),
                    "horario", "10:00",
                    "vagasTotais", 1
                ))))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.erro").exists())
            .andExpect(jsonPath("$.campos.nome").value("Nome da partida é obrigatório"))
            .andExpect(jsonPath("$.campos.vagasTotais").value("Informe pelo menos 2 vagas"))
            .andExpect(jsonPath("$.campos.dataHora").value("Data e horário devem estar no futuro"));
    }

    @Test
    void deveBloquearConflitoDeReservaPelaApi() throws Exception {
        criarPartida("Pelada Conflito", quadraPrincipal.getId(), amanha, "10:00", 6);

        mockMvc.perform(post("/api/partidas")
                .header("X-User-Id", organizador.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(partidaPayload(
                    "Outra Pelada", quadraPrincipal.getId(), amanha, "10:00", 6
                ))))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.erro").value("Quadra já reservada neste horário"));
    }

    @Test
    void deveBloquearOperacoesDeNaoOrganizador() throws Exception {
        Long partidaId = criarPartida("Pelada Privada", quadraPrincipal.getId(), amanha, "10:00", 6);

        mockMvc.perform(put("/api/partidas/{id}", partidaId)
                .header("X-User-Id", jogador.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(partidaPayload(
                    "Tentativa", quadraPrincipal.getId(), depoisDeAmanha, "11:00", 6
                ))))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.erro").value("Apenas o organizador pode editar"));

        mockMvc.perform(delete("/api/partidas/{id}", partidaId)
                .header("X-User-Id", jogador.getId()))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.erro").value("Apenas o organizador pode cancelar"));
    }

    @Test
    void deveBloquearUsuarioInexistenteNoHeader() throws Exception {
        Long partidaId = criarPartida("Pelada Segura", quadraPrincipal.getId(), amanha, "10:00", 6);

        mockMvc.perform(post("/api/partidas/{id}/inscrever", partidaId)
                .header("X-User-Id", 999L))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.erro").value("Usuário autenticado não encontrado"));
    }

    private Long criarPartida(String nome, Long quadraId, String data, String horario, int vagasTotais) throws Exception {
        String criadaJson = mockMvc.perform(post("/api/partidas")
                .header("X-User-Id", organizador.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(partidaPayload(nome, quadraId, data, horario, vagasTotais))))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();
        return objectMapper.readTree(criadaJson).get("id").asLong();
    }

    private Map<String, Object> partidaPayload(String nome, Long quadraId, String data, String horario, int vagasTotais) {
        return Map.of(
            "quadraId", quadraId,
            "nome", nome,
            "data", data,
            "horario", horario,
            "vagasTotais", vagasTotais,
            "nivel", "Intermediário"
        );
    }

    private Usuario criarUsuario(String nome, String email) {
        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenha("senha123");
        return usuarioRepository.save(usuario);
    }

    private Quadra criarQuadra(String nome) {
        Quadra quadra = new Quadra();
        quadra.setNome(nome);
        quadra.setEndereco("Rua Teste, 123");
        quadra.setTipo("Society");
        quadra.setCapacidade(10);
        quadra.setPreco(150.0);
        quadra.setEmoji("⚽");
        return quadraRepository.save(quadra);
    }
}
