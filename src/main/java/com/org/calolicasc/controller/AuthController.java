package com.org.calolicasc.controller;

import com.org.calolicasc.dto.CadastroRequest;
import com.org.calolicasc.dto.LoginRequest;
import com.org.calolicasc.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticacao", description = "Login e cadastro de usuarios")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Operacao realizada com sucesso"),
    @ApiResponse(responseCode = "400", description = "Dados invalidos"),
    @ApiResponse(responseCode = "401", description = "Credenciais invalidas")
})
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    @Operation(summary = "Realiza login", description = "Autentica um usuario e retorna seus dados para o frontend.")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(usuarioService.login(request.getEmail(), request.getSenha()));
    }

    @PostMapping("/cadastro")
    @Operation(summary = "Cadastra usuario", description = "Cria uma nova conta de usuario jogador.")
    @ApiResponse(responseCode = "201", description = "Usuario criado com sucesso")
    public ResponseEntity<?> cadastro(@Valid @RequestBody CadastroRequest request) {
        return ResponseEntity.status(201).body(usuarioService.cadastrar(
            request.getNome(),
            request.getEmail(),
            request.getSenha(),
            request.getCidade(),
            request.getEstado(),
            request.getPosicao(),
            request.getPreferencias()
        ));
    }
}
