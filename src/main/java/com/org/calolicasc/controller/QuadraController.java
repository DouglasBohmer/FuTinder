package com.org.calolicasc.controller;

import com.org.calolicasc.service.QuadraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/quadras")
public class QuadraController {

    @Autowired
    private QuadraService quadraService;

    @GetMapping
    public ResponseEntity<?> listarTodas() {
        return ResponseEntity.ok(quadraService.listarTodas());
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<?> listarDisponiveis(
            @RequestParam(required = false) String data,
            @RequestParam(required = false) String horario) {
        return ResponseEntity.ok(quadraService.listarDisponiveis(data, horario));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> body) {
        try {
            return ResponseEntity.status(201).body(quadraService.criar(
                (String) body.get("nome"),
                (String) body.get("endereco"),
                (String) body.get("tipo"),
                body.get("capacidade") != null ? ((Number) body.get("capacidade")).intValue() : null,
                body.get("preco") != null ? ((Number) body.get("preco")).doubleValue() : null,
                (String) body.get("emoji")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            return ResponseEntity.ok(quadraService.atualizar(
                id,
                (String) body.get("nome"),
                (String) body.get("endereco"),
                (String) body.get("tipo"),
                body.get("capacidade") != null ? ((Number) body.get("capacidade")).intValue() : null,
                body.get("preco") != null ? ((Number) body.get("preco")).doubleValue() : null,
                (String) body.get("emoji")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            quadraService.deletar(id);
            return ResponseEntity.ok(Map.of("mensagem", "Quadra removida com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
