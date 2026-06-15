package com.org.calolicasc.controller;

import com.org.calolicasc.service.PartidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/partidas")
public class PartidaController {

    @Autowired
    private PartidaService partidaService;

    @GetMapping("/publicas")
    public ResponseEntity<?> listarPublicas() {
        return ResponseEntity.ok(partidaService.listarPublicas());
    }

    @GetMapping("/minhas")
    public ResponseEntity<?> listarMinhas(@RequestHeader("X-User-Id") Long usuarioId) {
        try {
            return ResponseEntity.ok(partidaService.listarMinhas(usuarioId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetalhes(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long usuarioId) {
        try {
            return ResponseEntity.ok(partidaService.getDetalhes(id, usuarioId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/convite/{token}")
    public ResponseEntity<?> getByToken(@PathVariable String token) {
        try {
            return ResponseEntity.ok(partidaService.getByToken(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> criarPartida(
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestBody Map<String, Object> body) {
        try {
            return ResponseEntity.status(201).body(partidaService.criarPartida(
                usuarioId,
                Long.valueOf(body.get("quadraId").toString()),
                (String) body.get("nome"),
                (String) body.get("data"),
                (String) body.get("horario"),
                Integer.valueOf(body.get("vagasTotais").toString()),
                (String) body.get("nivel")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping("/{id}/inscrever")
    public ResponseEntity<?> inscrever(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long usuarioId) {
        try {
            return ResponseEntity.ok(partidaService.inscreverUsuario(id, usuarioId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/{id}/toggle-publico")
    public ResponseEntity<?> togglePublico(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long usuarioId) {
        try {
            return ResponseEntity.ok(partidaService.togglePublico(id, usuarioId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/sair")
    public ResponseEntity<?> sair(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long usuarioId) {
        try {
            return ResponseEntity.ok(partidaService.sairDaPartida(id, usuarioId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long usuarioId) {
        try {
            return ResponseEntity.ok(partidaService.cancelarPartida(id, usuarioId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
