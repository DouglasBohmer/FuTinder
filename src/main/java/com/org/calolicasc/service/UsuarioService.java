package com.org.calolicasc.service;

import com.org.calolicasc.model.Usuario;
import com.org.calolicasc.repository.InscricaoRepository;
import com.org.calolicasc.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final InscricaoRepository inscricaoRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, InscricaoRepository inscricaoRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.inscricaoRepository = inscricaoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> login(String email, String senha) {
        Optional<Usuario> opt = usuarioRepository.findByEmail(email);
        if (opt.isEmpty() || !senhaConfere(senha, opt.get().getSenha())) {
            throw new RuntimeException("E-mail ou senha incorretos");
        }
        Usuario usuario = opt.get();
        if (!senhaCriptografada(usuario.getSenha())) {
            usuario.setSenha(passwordEncoder.encode(senha));
            usuario = usuarioRepository.save(usuario);
        }
        return toResponse(usuario);
    }

    public Map<String, Object> cadastrar(String nome, String email, String senha,
                                          String cidade, String estado, String posicao, String preferencias) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("E-mail já cadastrado");
        }
        Usuario u = new Usuario();
        u.setNome(nome);
        u.setEmail(email);
        u.setSenha(passwordEncoder.encode(senha));
        u.setCidade(cidade);
        u.setEstado(estado);
        u.setPosicao(posicao);
        u.setPreferencias(preferencias);
        u = usuarioRepository.save(u);
        return toResponse(u);
    }

    public Map<String, Object> getPerfil(Long usuarioId) {
        Usuario u = buscarUsuarioAutenticado(usuarioId);
        long jogosConfirmados = inscricaoRepository.findByUsuarioId(usuarioId).stream()
            .filter(i -> "CONFIRMADO".equals(i.getStatus())).count();
        Map<String, Object> resp = toResponse(u);
        resp.put("jogosRealizados", jogosConfirmados);
        return resp;
    }

    public Map<String, Object> atualizarPerfil(Long usuarioId, String nome, String cidade,
                                                 String estado, String posicao, String preferencias) {
        Usuario u = buscarUsuarioAutenticado(usuarioId);
        if (nome != null && !nome.isBlank()) u.setNome(nome);
        if (cidade != null) u.setCidade(cidade);
        if (estado != null) u.setEstado(estado);
        if (posicao != null) u.setPosicao(posicao);
        if (preferencias != null) u.setPreferencias(preferencias);
        u = usuarioRepository.save(u);
        return toResponse(u);
    }

    public Map<String, Object> salvarFoto(Long usuarioId, String foto) {
        if (foto == null || foto.isBlank()) throw new RuntimeException("Foto inválida");
        Usuario u = buscarUsuarioAutenticado(usuarioId);
        u.setFoto(foto);
        u = usuarioRepository.save(u);
        return toResponse(u);
    }

    public java.util.List<Map<String, Object>> buscarJogadores(String nome, String posicao, String cidade) {
        return usuarioRepository.findAll().stream()
            .filter(u -> nome == null || nome.isBlank() ||
                (u.getNome() != null && u.getNome().toLowerCase().contains(nome.toLowerCase())))
            .filter(u -> posicao == null || posicao.isBlank() ||
                posicao.equalsIgnoreCase(u.getPosicao()))
            .filter(u -> cidade == null || cidade.isBlank() ||
                (u.getCidade() != null && u.getCidade().toLowerCase().contains(cidade.toLowerCase())))
            .map(u -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", u.getId());
                m.put("nome", u.getNome());
                m.put("posicao", u.getPosicao());
                m.put("cidade", u.getCidade());
                m.put("estado", u.getEstado());
                m.put("preferencias", u.getPreferencias());
                return m;
            })
            .collect(java.util.stream.Collectors.toList());
    }

    public void alterarSenha(Long usuarioId, String senhaAtual, String novaSenha) {
        if (senhaAtual == null || novaSenha == null || novaSenha.isBlank()) {
            throw new RuntimeException("Preencha todos os campos de senha");
        }
        Usuario u = buscarUsuarioAutenticado(usuarioId);
        if (!senhaConfere(senhaAtual, u.getSenha())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        u.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(u);
    }

    private Usuario buscarUsuarioAutenticado(Long usuarioId) {
        if (usuarioId == null) {
            throw new RuntimeException("Usuário não autenticado");
        }
        return usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado"));
    }

    private boolean senhaConfere(String senhaInformada, String senhaArmazenada) {
        if (senhaInformada == null || senhaArmazenada == null) {
            return false;
        }
        if (senhaCriptografada(senhaArmazenada)) {
            return passwordEncoder.matches(senhaInformada, senhaArmazenada);
        }
        return senhaArmazenada.equals(senhaInformada);
    }

    private boolean senhaCriptografada(String senha) {
        return senha != null &&
            (senha.startsWith("$2a$") || senha.startsWith("$2b$") || senha.startsWith("$2y$"));
    }

    private Map<String, Object> toResponse(Usuario u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", u.getId());
        m.put("nome", u.getNome());
        m.put("email", u.getEmail());
        m.put("cidade", u.getCidade());
        m.put("estado", u.getEstado());
        m.put("posicao", u.getPosicao());
        m.put("preferencias", u.getPreferencias());
        m.put("foto", u.getFoto());
        return m;
    }
}
