package com.org.calolicasc.controller;

import com.org.calolicasc.dto.QuadraRequest;
import com.org.calolicasc.service.QuadraService;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/quadras")
@Tag(name = "Quadras", description = "CRUD de quadras esportivas")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Operacao realizada com sucesso"),
    @ApiResponse(responseCode = "400", description = "Dados invalidos")
})
public class QuadraController {

    private final QuadraService quadraService;

    public QuadraController(QuadraService quadraService) {
        this.quadraService = quadraService;
    }

    @GetMapping
    @Operation(summary = "Lista quadras", description = "Retorna todas as quadras cadastradas.")
    public ResponseEntity<?> listarTodas() {
        return ResponseEntity.ok(quadraService.listarTodas());
    }

    @GetMapping("/disponiveis")
    @Operation(summary = "Lista quadras disponiveis", description = "Retorna quadras sem partida no dia e horario informados.")
    public ResponseEntity<?> listarDisponiveis(
            @Parameter(description = "Data no formato yyyy-MM-dd")
            @RequestParam(required = false) String data,
            @Parameter(description = "Horario no formato HH:mm")
            @RequestParam(required = false) String horario) {
        return ResponseEntity.ok(quadraService.listarDisponiveis(data, horario));
    }

    @PostMapping
    @Operation(summary = "Cria quadra", description = "Cadastra uma nova quadra esportiva.")
    @ApiResponse(responseCode = "201", description = "Quadra criada com sucesso")
    public ResponseEntity<?> criar(@Valid @RequestBody QuadraRequest request) {
        return ResponseEntity.status(201).body(quadraService.criar(
            request.getNome(),
            request.getEndereco(),
            request.getTipo(),
            request.getCapacidade(),
            request.getPreco(),
            request.getEmoji()
        ));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza quadra", description = "Edita os dados de uma quadra existente.")
    public ResponseEntity<?> atualizar(
            @Parameter(description = "ID da quadra", required = true)
            @PathVariable Long id,
            @Valid @RequestBody QuadraRequest request) {
        return ResponseEntity.ok(quadraService.atualizar(
            id,
            request.getNome(),
            request.getEndereco(),
            request.getTipo(),
            request.getCapacidade(),
            request.getPreco(),
            request.getEmoji()
        ));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove quadra", description = "Exclui uma quadra pelo ID.")
    public ResponseEntity<?> deletar(
            @Parameter(description = "ID da quadra", required = true)
            @PathVariable Long id) {
        quadraService.deletar(id);
        return ResponseEntity.ok(Map.of("mensagem", "Quadra removida com sucesso"));
    }
}
