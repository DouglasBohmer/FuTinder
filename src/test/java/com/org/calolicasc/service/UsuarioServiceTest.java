package com.org.calolicasc.service;

import com.org.calolicasc.model.Usuario;
import com.org.calolicasc.repository.InscricaoRepository;
import com.org.calolicasc.repository.PartidaRepository;
import com.org.calolicasc.repository.QuadraRepository;
import com.org.calolicasc.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class UsuarioServiceTest {

    @Autowired private UsuarioService usuarioService;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private InscricaoRepository inscricaoRepository;
    @Autowired private PartidaRepository partidaRepository;
    @Autowired private QuadraRepository quadraRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    @BeforeEach
    void setUp() {
        inscricaoRepository.deleteAll();
        partidaRepository.deleteAll();
        quadraRepository.deleteAll();
        usuarioRepository.deleteAll();
    }

    @Test
    void deveCriptografarSenhaNoCadastroEAutenticarComSenhaOriginal() {
        Map<String, Object> cadastro = usuarioService.cadastrar(
            "Jogador Seguro", "seguro@email.com", "senha123", "Sao Paulo", "SP", "Atacante", "Society");

        Usuario salvo = usuarioRepository.findById(((Number) cadastro.get("id")).longValue()).orElseThrow();

        assertThat(salvo.getSenha()).isNotEqualTo("senha123");
        assertThat(passwordEncoder.matches("senha123", salvo.getSenha())).isTrue();

        Map<String, Object> login = usuarioService.login("seguro@email.com", "senha123");

        assertThat(login).containsEntry("email", "seguro@email.com");
    }

    @Test
    void deveMigrarSenhaAntigaEmTextoPuroAposLoginComSucesso() {
        Usuario usuario = new Usuario();
        usuario.setNome("Legado");
        usuario.setEmail("legado@email.com");
        usuario.setSenha("senha-legada");
        usuarioRepository.save(usuario);

        usuarioService.login("legado@email.com", "senha-legada");

        Usuario atualizado = usuarioRepository.findByEmail("legado@email.com").orElseThrow();
        assertThat(atualizado.getSenha()).isNotEqualTo("senha-legada");
        assertThat(passwordEncoder.matches("senha-legada", atualizado.getSenha())).isTrue();
    }

    @Test
    void deveCriptografarNovaSenhaERecusarSenhaAntiga() {
        Map<String, Object> cadastro = usuarioService.cadastrar(
            "Troca Senha", "troca@email.com", "senha123", null, null, null, null);
        Long usuarioId = ((Number) cadastro.get("id")).longValue();

        usuarioService.alterarSenha(usuarioId, "senha123", "nova123");

        Usuario atualizado = usuarioRepository.findById(usuarioId).orElseThrow();
        assertThat(passwordEncoder.matches("nova123", atualizado.getSenha())).isTrue();
        assertThatThrownBy(() -> usuarioService.login("troca@email.com", "senha123"))
            .hasMessageContaining("E-mail ou senha incorretos");
        assertThat(usuarioService.login("troca@email.com", "nova123")).containsEntry("email", "troca@email.com");
    }

    @Test
    void deveBloquearOperacaoProtegidaParaUsuarioInexistente() {
        assertThatThrownBy(() -> usuarioService.getPerfil(999L))
            .hasMessageContaining("Usuário autenticado não encontrado");
    }
}
