package com.org.calolicasc.service;

import com.org.calolicasc.model.Quadra;
import com.org.calolicasc.repository.PartidaRepository;
import com.org.calolicasc.repository.QuadraRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuadraService {

    private final QuadraRepository quadraRepository;
    private final PartidaRepository partidaRepository;

    public QuadraService(QuadraRepository quadraRepository, PartidaRepository partidaRepository) {
        this.quadraRepository = quadraRepository;
        this.partidaRepository = partidaRepository;
    }

    public List<Map<String, Object>> listarTodas() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Quadra q : quadraRepository.findAll()) {
            result.add(toResponse(q, true));
        }
        return result;
    }

    public List<Map<String, Object>> listarDisponiveis(String data, String horario) {
        List<Quadra> quadras = quadraRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Quadra q : quadras) {
            boolean disponivel = true;
            if (data != null && horario != null && !data.isEmpty() && !horario.isEmpty()) {
                try {
                    LocalDate localDate = LocalDate.parse(data);
                    LocalTime localTime = LocalTime.parse(horario);
                    LocalDateTime dt = LocalDateTime.of(localDate, localTime);
                    disponivel = !partidaRepository.existsByQuadraIdAndDataHoraAndCanceladaFalse(q.getId(), dt);
                } catch (Exception ignored) {}
            }
            result.add(toResponse(q, disponivel));
        }
        return result;
    }

    public Map<String, Object> criar(String nome, String endereco, String tipo,
                                      Integer capacidade, Double preco, String emoji) {
        Quadra q = new Quadra();
        q.setNome(nome);
        q.setEndereco(endereco);
        q.setTipo(tipo);
        q.setCapacidade(capacidade);
        q.setPreco(preco);
        q.setEmoji(emoji != null && !emoji.isBlank() ? emoji : "⚽");
        q = quadraRepository.save(q);
        return toResponse(q, true);
    }

    public Map<String, Object> atualizar(Long id, String nome, String endereco, String tipo,
                                          Integer capacidade, Double preco, String emoji) {
        Quadra q = quadraRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Quadra não encontrada"));
        if (nome != null) q.setNome(nome);
        if (endereco != null) q.setEndereco(endereco);
        if (tipo != null) q.setTipo(tipo);
        if (capacidade != null) q.setCapacidade(capacidade);
        if (preco != null) q.setPreco(preco);
        if (emoji != null) q.setEmoji(emoji);
        q = quadraRepository.save(q);
        return toResponse(q, true);
    }

    public void deletar(Long id) {
        if (!quadraRepository.existsById(id)) {
            throw new RuntimeException("Quadra não encontrada");
        }
        quadraRepository.deleteById(id);
    }

    public Map<String, Object> toResponse(Quadra q, boolean disponivel) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", q.getId());
        m.put("nome", q.getNome());
        m.put("endereco", q.getEndereco());
        m.put("tipo", q.getTipo());
        m.put("capacidade", q.getCapacidade());
        m.put("preco", q.getPreco());
        m.put("emoji", q.getEmoji());
        m.put("disponivel", disponivel);
        return m;
    }
}
