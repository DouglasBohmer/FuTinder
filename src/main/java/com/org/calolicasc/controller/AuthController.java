package com.org.calolicasc.controller;

import com.org.calolicasc.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(usuarioService.login(body.get("email"), body.get("senha")));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastro(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.status(201).body(usuarioService.cadastrar(
                body.get("nome"), body.get("email"), body.get("senha"),
                body.get("cidade"), body.get("estado"), body.get("posicao"), body.get("preferencias")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
