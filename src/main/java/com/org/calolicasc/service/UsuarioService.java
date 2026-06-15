package com.org.calolicasc.service;

import com.org.calolicasc.model.Usuario;
import com.org.calolicasc.repository.InscricaoRepository;
import com.org.calolicasc.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private InscricaoRepository inscricaoRepository;

    public Map<String, Object> login(String email, String senha) {
        Optional<Usuario> opt = usuarioRepository.findByEmail(email);
        if (opt.isEmpty() || !opt.get().getSenha().equals(senha)) {
            throw new RuntimeException("E-mail ou senha incorretos");
        }
        return toResponse(opt.get());
    }

    public Map<String, Object> cadastrar(String nome, String email, String senha,
                                          String cidade, String estado, String posicao, String preferencias) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("E-mail já cadastrado");
        }
        Usuario u = new Usuario();
        u.setNome(nome);
        u.setEmail(email);
        u.setSenha(senha);
        u.setCidade(cidade);
        u.setEstado(estado);
        u.setPosicao(posicao);
        u.setPreferencias(preferencias);
        u = usuarioRepository.save(u);
        return toResponse(u);
    }

    public Map<String, Object> getPerfil(Long usuarioId) {
        Usuario u = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        long jogosConfirmados = inscricaoRepository.findByUsuarioId(usuarioId).stream()
            .filter(i -> "CONFIRMADO".equals(i.getStatus())).count();
        Map<String, Object> resp = toResponse(u);
        resp.put("jogosRealizados", jogosConfirmados);
        return resp;
    }

    public Map<String, Object> atualizarPerfil(Long usuarioId, String nome, String cidade,
                                                 String estado, String posicao, String preferencias) {
        Usuario u = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
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
        Usuario u = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
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
        Usuario u = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        if (!u.getSenha().equals(senhaAtual)) {
            throw new RuntimeException("Senha atual incorreta");
        }
        u.setSenha(novaSenha);
        usuarioRepository.save(u);
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
