package com.org.calolicasc.controller;

import com.org.calolicasc.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<?> getPerfil(@RequestHeader("X-User-Id") Long usuarioId) {
        try {
            return ResponseEntity.ok(usuarioService.getPerfil(usuarioId));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> atualizarPerfil(
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(usuarioService.atualizarPerfil(
                usuarioId, body.get("nome"), body.get("cidade"),
                body.get("estado"), body.get("posicao"), body.get("preferencias")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/foto")
    public ResponseEntity<?> salvarFoto(
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(usuarioService.salvarFoto(usuarioId, body.get("foto")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String posicao,
            @RequestParam(required = false) String cidade) {
        return ResponseEntity.ok(usuarioService.buscarJogadores(nome, posicao, cidade));
    }

    @PutMapping("/senha")
    public ResponseEntity<?> alterarSenha(
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestBody Map<String, String> body) {
        try {
            usuarioService.alterarSenha(usuarioId, body.get("senhaAtual"), body.get("novaSenha"));
            return ResponseEntity.ok(Map.of("msg", "Senha alterada com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
