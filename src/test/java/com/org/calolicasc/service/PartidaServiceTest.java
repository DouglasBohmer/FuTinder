package com.org.calolicasc.service;

import com.org.calolicasc.model.Quadra;
import com.org.calolicasc.model.Usuario;
import com.org.calolicasc.repository.InscricaoRepository;
import com.org.calolicasc.repository.PartidaRepository;
import com.org.calolicasc.repository.QuadraRepository;
import com.org.calolicasc.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class PartidaServiceTest {

    @Autowired private PartidaService partidaService;
    @Autowired private PartidaRepository partidaRepository;
    @Autowired private InscricaoRepository inscricaoRepository;
    @Autowired private QuadraRepository quadraRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    private Usuario organizador;
    private Usuario outroUsuario;
    private Usuario terceiroUsuario;
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

        organizador = criarUsuario("Organizador", "organizador@email.com");
        outroUsuario = criarUsuario("Outro", "outro@email.com");
        terceiroUsuario = criarUsuario("Terceiro", "terceiro@email.com");
        quadraPrincipal = criarQuadra("Quadra Principal");
        quadraAlternativa = criarQuadra("Quadra Alternativa");
        amanha = LocalDate.now().plusDays(1).toString();
        depoisDeAmanha = LocalDate.now().plusDays(2).toString();
    }

    @Test
    void deveAtualizarPartidaComSucesso() {
        Map<String, Object> criada = partidaService.criarPartida(
            organizador.getId(), quadraPrincipal.getId(), "Pelada Antiga", amanha, "10:00", 10, "Iniciante");

        Map<String, Object> atualizada = partidaService.atualizarPartida(
            ((Number) criada.get("id")).longValue(), organizador.getId(), quadraAlternativa.getId(),
            "Pelada Editada", depoisDeAmanha, "12:00", 14, "Avançado");

        assertThat(atualizada.get("nome")).isEqualTo("Pelada Editada");
        assertThat(atualizada.get("quadraId")).isEqualTo(quadraAlternativa.getId());
        assertThat(atualizada.get("horario")).isEqualTo("12:00");
        assertThat(atualizada.get("vagasTotais")).isEqualTo(14);
        assertThat(atualizada.get("vagasDisponiveis")).isEqualTo(13);
        assertThat(atualizada.get("nivel")).isEqualTo("Avançado");
    }

    @Test
    void deveBloquearEdicaoPorUsuarioQueNaoEOrganizador() {
        Map<String, Object> criada = partidaService.criarPartida(
            organizador.getId(), quadraPrincipal.getId(), "Pelada", amanha, "10:00", 10, "Intermediário");

        assertThatThrownBy(() -> partidaService.atualizarPartida(
            ((Number) criada.get("id")).longValue(), outroUsuario.getId(), quadraPrincipal.getId(),
            "Tentativa", amanha, "11:00", 10, "Intermediário"))
            .hasMessageContaining("Apenas o organizador");
    }

    @Test
    void deveBloquearConflitoDeQuadraEHorarioComOutraPartida() {
        partidaService.criarPartida(
            organizador.getId(), quadraPrincipal.getId(), "Pelada Um", amanha, "10:00", 10, "Intermediário");
        Map<String, Object> segunda = partidaService.criarPartida(
            organizador.getId(), quadraAlternativa.getId(), "Pelada Dois", amanha, "11:00", 10, "Intermediário");

        assertThatThrownBy(() -> partidaService.atualizarPartida(
            ((Number) segunda.get("id")).longValue(), organizador.getId(), quadraPrincipal.getId(),
            "Pelada Dois", amanha, "10:00", 10, "Intermediário"))
            .hasMessageContaining("Quadra já reservada");
    }

    @Test
    void deveBloquearTotalDeVagasMenorQueJogadoresConfirmados() {
        Map<String, Object> criada = partidaService.criarPartida(
            organizador.getId(), quadraPrincipal.getId(), "Pelada", amanha, "10:00", 4, "Intermediário");
        partidaService.inscreverUsuario(((Number) criada.get("id")).longValue(), outroUsuario.getId());
        partidaService.inscreverUsuario(((Number) criada.get("id")).longValue(), terceiroUsuario.getId());

        assertThatThrownBy(() -> partidaService.atualizarPartida(
            ((Number) criada.get("id")).longValue(), organizador.getId(), quadraPrincipal.getId(),
            "Pelada", amanha, "10:00", 2, "Intermediário"))
            .hasMessageContaining("jogadores confirmados");
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
