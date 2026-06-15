package com.org.calolicasc.controller;

import com.org.calolicasc.dto.PartidaRequest;
import com.org.calolicasc.service.PartidaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/partidas")
@Tag(name = "Partidas", description = "CRUD e inscricoes de partidas")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Operacao realizada com sucesso"),
    @ApiResponse(responseCode = "400", description = "Dados invalidos ou regra de negocio violada"),
    @ApiResponse(responseCode = "401", description = "Usuario nao autenticado")
})
public class PartidaController {

    private final PartidaService partidaService;

    public PartidaController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    @GetMapping("/publicas")
    @Operation(summary = "Lista partidas publicas", description = "Retorna partidas publicas ainda disponiveis.")
    public ResponseEntity<?> listarPublicas() {
        return ResponseEntity.ok(partidaService.listarPublicas());
    }

    @GetMapping("/minhas")
    @Operation(summary = "Lista minhas partidas", description = "Retorna partidas criadas ou inscritas pelo usuario.")
    public ResponseEntity<?> listarMinhas(
            @Parameter(description = "ID do usuario autenticado", required = true)
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(partidaService.listarMinhas(usuarioId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca detalhes da partida", description = "Retorna os detalhes da partida e o vinculo do usuario, quando informado.")
    public ResponseEntity<?> getDetalhes(
            @Parameter(description = "ID da partida", required = true)
            @PathVariable Long id,
            @Parameter(description = "ID do usuario autenticado")
            @RequestHeader(value = "X-User-Id", required = false) Long usuarioId) {
        return ResponseEntity.ok(partidaService.getDetalhes(id, usuarioId));
    }

    @GetMapping("/convite/{token}")
    @Operation(summary = "Busca partida por convite", description = "Retorna uma partida usando o token publico de convite.")
    public ResponseEntity<?> getByToken(
            @Parameter(description = "Token de convite", required = true)
            @PathVariable String token) {
        return ResponseEntity.ok(partidaService.getByToken(token));
    }

    @PostMapping
    @Operation(summary = "Cria partida", description = "Cria uma partida vinculada ao usuario organizador.")
    @ApiResponse(responseCode = "201", description = "Partida criada com sucesso")
    public ResponseEntity<?> criarPartida(
            @Parameter(description = "ID do usuario organizador", required = true)
            @RequestHeader("X-User-Id") Long usuarioId,
            @Valid @RequestBody PartidaRequest request) {
        return ResponseEntity.status(201).body(partidaService.criarPartida(
            usuarioId,
            request.getQuadraId(),
            request.getNome(),
            request.getData(),
            request.getHorario(),
            request.getVagasTotais(),
            request.getNivel()
        ));
    }

    @PostMapping("/{id}/inscrever")
    @Operation(summary = "Inscreve usuario", description = "Inscreve o usuario autenticado em uma partida.")
    public ResponseEntity<?> inscrever(
            @Parameter(description = "ID da partida", required = true)
            @PathVariable Long id,
            @Parameter(description = "ID do usuario autenticado", required = true)
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(partidaService.inscreverUsuario(id, usuarioId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza partida", description = "Edita partida existente quando o usuario e o organizador.")
    public ResponseEntity<?> atualizarPartida(
            @Parameter(description = "ID da partida", required = true)
            @PathVariable Long id,
            @Parameter(description = "ID do usuario organizador", required = true)
            @RequestHeader("X-User-Id") Long usuarioId,
            @Valid @RequestBody PartidaRequest request) {
        return ResponseEntity.ok(partidaService.atualizarPartida(
            id,
            usuarioId,
            request.getQuadraId(),
            request.getNome(),
            request.getData(),
            request.getHorario(),
            request.getVagasTotais(),
            request.getNivel()
        ));
    }

    @PutMapping("/{id}/toggle-publico")
    @Operation(summary = "Alterna visibilidade", description = "Muda uma partida entre publica e privada.")
    public ResponseEntity<?> togglePublico(
            @Parameter(description = "ID da partida", required = true)
            @PathVariable Long id,
            @Parameter(description = "ID do usuario organizador", required = true)
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(partidaService.togglePublico(id, usuarioId));
    }

    @DeleteMapping("/{id}/sair")
    @Operation(summary = "Sai da partida", description = "Remove a inscricao do usuario autenticado.")
    public ResponseEntity<?> sair(
            @Parameter(description = "ID da partida", required = true)
            @PathVariable Long id,
            @Parameter(description = "ID do usuario autenticado", required = true)
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(partidaService.sairDaPartida(id, usuarioId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancela partida", description = "Cancela logicamente uma partida quando o usuario e o organizador.")
    public ResponseEntity<?> cancelar(
            @Parameter(description = "ID da partida", required = true)
            @PathVariable Long id,
            @Parameter(description = "ID do usuario organizador", required = true)
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(partidaService.cancelarPartida(id, usuarioId));
    }
}
