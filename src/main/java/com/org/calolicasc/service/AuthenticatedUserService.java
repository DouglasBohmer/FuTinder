package com.org.calolicasc.service;

import com.org.calolicasc.model.Usuario;
import com.org.calolicasc.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthenticatedUserService {

    private final UsuarioRepository usuarioRepository;

    public AuthenticatedUserService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario requireAuthenticatedUser(Long usuarioId) {
        if (usuarioId == null) {
            throw new RuntimeException("Usuário não autenticado");
        }
        return usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado"));
    }
}
