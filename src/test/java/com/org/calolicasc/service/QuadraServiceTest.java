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
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class QuadraServiceTest {

    @Autowired private QuadraService quadraService;
    @Autowired private PartidaService partidaService;
    @Autowired private InscricaoRepository inscricaoRepository;
    @Autowired private PartidaRepository partidaRepository;
    @Autowired private QuadraRepository quadraRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    private Usuario organizador;
    private String amanha;

    @BeforeEach
    void setUp() {
        inscricaoRepository.deleteAll();
        partidaRepository.deleteAll();
        quadraRepository.deleteAll();
        usuarioRepository.deleteAll();

        organizador = criarUsuario("Organizador", "organizador.quadra@email.com");
        amanha = LocalDate.now().plusDays(1).toString();
    }

    @Test
    void deveExecutarCrudCompletoDeQuadras() {
        Map<String, Object> criada = quadraService.criar(
            "Arena Norte", "Rua Um, 10", "Society", 12, 180.0, null);
        Long id = ((Number) criada.get("id")).longValue();

        assertThat(criada)
            .containsEntry("nome", "Arena Norte")
            .containsEntry("emoji", "⚽");
        assertThat(quadraService.listarTodas()).hasSize(1);

        Map<String, Object> atualizada = quadraService.atualizar(
            id, "Arena Sul", "Rua Dois, 20", "Futsal", 10, 150.0, "🏟️");

        assertThat(atualizada)
            .containsEntry("nome", "Arena Sul")
            .containsEntry("endereco", "Rua Dois, 20")
            .containsEntry("tipo", "Futsal")
            .containsEntry("capacidade", 10)
            .containsEntry("preco", 150.0)
            .containsEntry("emoji", "🏟️");

        quadraService.deletar(id);

        assertThat(quadraService.listarTodas()).isEmpty();
    }

    @Test
    void deveMarcarQuadraIndisponivelQuandoExistePartidaNoHorario() {
        Map<String, Object> quadra = quadraService.criar(
            "Arena Horario", "Rua Tres, 30", "Society", 12, 180.0, "⚽");
        Long quadraId = ((Number) quadra.get("id")).longValue();
        partidaService.criarPartida(
            organizador.getId(), quadraId, "Reserva", amanha, "10:00", 10, "Intermediário");

        List<Map<String, Object>> disponiveis = quadraService.listarDisponiveis(amanha, "10:00");

        assertThat(disponiveis).hasSize(1);
        assertThat(disponiveis.get(0))
            .containsEntry("id", quadraId)
            .containsEntry("disponivel", false);
    }

    @Test
    void deveFalharAoAtualizarOuDeletarQuadraInexistente() {
        assertThatThrownBy(() -> quadraService.atualizar(
            999L, "Arena", "Rua", "Society", 10, 100.0, "⚽"))
            .hasMessageContaining("Quadra não encontrada");

        assertThatThrownBy(() -> quadraService.deletar(999L))
            .hasMessageContaining("Quadra não encontrada");
    }

    private Usuario criarUsuario(String nome, String email) {
        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenha("senha123");
        return usuarioRepository.save(usuario);
    }
}
