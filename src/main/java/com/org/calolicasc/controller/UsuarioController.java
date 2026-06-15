package com.org.calolicasc.controller;

import com.org.calolicasc.dto.FotoRequest;
import com.org.calolicasc.dto.PerfilRequest;
import com.org.calolicasc.dto.SenhaRequest;
import com.org.calolicasc.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Perfil, busca e senha dos usuarios")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Operacao realizada com sucesso"),
    @ApiResponse(responseCode = "400", description = "Dados invalidos"),
    @ApiResponse(responseCode = "401", description = "Usuario nao autenticado")
})
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/perfil")
    @Operation(summary = "Busca perfil", description = "Retorna os dados do usuario autenticado pelo header X-User-Id.")
    public ResponseEntity<?> getPerfil(
            @Parameter(description = "ID do usuario autenticado", required = true)
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(usuarioService.getPerfil(usuarioId));
    }

    @PutMapping("/perfil")
    @Operation(summary = "Atualiza perfil", description = "Atualiza nome, cidade, estado, posicao e preferencias do usuario.")
    public ResponseEntity<?> atualizarPerfil(
            @Parameter(description = "ID do usuario autenticado", required = true)
            @RequestHeader("X-User-Id") Long usuarioId,
            @Valid @RequestBody PerfilRequest request) {
        return ResponseEntity.ok(usuarioService.atualizarPerfil(
            usuarioId,
            request.getNome(),
            request.getCidade(),
            request.getEstado(),
            request.getPosicao(),
            request.getPreferencias()
        ));
    }

    @PutMapping("/foto")
    @Operation(summary = "Atualiza foto", description = "Salva a foto/base64 ou URL da imagem do perfil.")
    public ResponseEntity<?> salvarFoto(
            @Parameter(description = "ID do usuario autenticado", required = true)
            @RequestHeader("X-User-Id") Long usuarioId,
            @Valid @RequestBody FotoRequest request) {
        return ResponseEntity.ok(usuarioService.salvarFoto(usuarioId, request.getFoto()));
    }

    @GetMapping("/buscar")
    @Operation(summary = "Busca jogadores", description = "Filtra jogadores por nome, posicao e cidade.")
    public ResponseEntity<?> buscar(
            @Parameter(description = "Trecho do nome do jogador")
            @RequestParam(required = false) String nome,
            @Parameter(description = "Posicao preferida do jogador")
            @RequestParam(required = false) String posicao,
            @Parameter(description = "Cidade do jogador")
            @RequestParam(required = false) String cidade) {
        return ResponseEntity.ok(usuarioService.buscarJogadores(nome, posicao, cidade));
    }

    @PutMapping("/senha")
    @Operation(summary = "Altera senha", description = "Valida a senha atual e grava uma nova senha.")
    public ResponseEntity<?> alterarSenha(
            @Parameter(description = "ID do usuario autenticado", required = true)
            @RequestHeader("X-User-Id") Long usuarioId,
            @Valid @RequestBody SenhaRequest request) {
        usuarioService.alterarSenha(usuarioId, request.getSenhaAtual(), request.getNovaSenha());
        return ResponseEntity.ok(Map.of("msg", "Senha alterada com sucesso"));
    }
}
