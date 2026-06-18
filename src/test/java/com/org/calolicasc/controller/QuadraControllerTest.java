package com.org.calolicasc.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.org.calolicasc.repository.InscricaoRepository;
import com.org.calolicasc.repository.PartidaRepository;
import com.org.calolicasc.repository.QuadraRepository;
import com.org.calolicasc.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class QuadraControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private InscricaoRepository inscricaoRepository;
    @Autowired private PartidaRepository partidaRepository;
    @Autowired private QuadraRepository quadraRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    @BeforeEach
    void setUp() {
        inscricaoRepository.deleteAll();
        partidaRepository.deleteAll();
        quadraRepository.deleteAll();
        usuarioRepository.deleteAll();
    }

    @Test
    void deveExecutarCrudCompletoDeQuadrasPelaApi() throws Exception {
        String criadaJson = mockMvc.perform(post("/api/quadras")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "nome", "Arena API",
                    "endereco", "Rua API, 10",
                    "tipo", "Society",
                    "capacidade", 12,
                    "preco", 200.0,
                    "emoji", "⚽"
                ))))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.nome").value("Arena API"))
            .andReturn()
            .getResponse()
            .getContentAsString();
        Long id = objectMapper.readTree(criadaJson).get("id").asLong();

        mockMvc.perform(get("/api/quadras"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].id").value(id));

        mockMvc.perform(put("/api/quadras/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "nome", "Arena API Editada",
                    "endereco", "Rua API, 20",
                    "tipo", "Futsal",
                    "capacidade", 10,
                    "preco", 150.0,
                    "emoji", "🏟️"
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nome").value("Arena API Editada"))
            .andExpect(jsonPath("$.capacidade").value(10));

        mockMvc.perform(delete("/api/quadras/{id}", id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.mensagem").value("Quadra removida com sucesso"));

        mockMvc.perform(get("/api/quadras"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void deveValidarDadosObrigatoriosDeQuadra() throws Exception {
        mockMvc.perform(post("/api/quadras")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "nome", "",
                    "endereco", "",
                    "tipo", "Society",
                    "capacidade", 1,
                    "preco", -1.0
                ))))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.erro").exists())
            .andExpect(jsonPath("$.campos.nome").value("Nome da quadra é obrigatório"))
            .andExpect(jsonPath("$.campos.capacidade").value("Capacidade deve ser de pelo menos 2 jogadores"));
    }
}
