package com.org.calolicasc.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class PartidaRequest {

    @NotNull(message = "Quadra é obrigatória")
    private Long quadraId;

    @NotBlank(message = "Nome da partida é obrigatório")
    private String nome;

    @NotBlank(message = "Data é obrigatória")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Data deve estar no formato yyyy-MM-dd")
    private String data;

    @NotBlank(message = "Horário é obrigatório")
    @Pattern(regexp = "\\d{2}:\\d{2}", message = "Horário deve estar no formato HH:mm")
    private String horario;

    @NotNull(message = "Total de vagas é obrigatório")
    @Min(value = 2, message = "Informe pelo menos 2 vagas")
    private Integer vagasTotais;

    private String nivel;

    @JsonIgnore
    @Future(message = "Data e horário devem estar no futuro")
    public LocalDateTime getDataHora() {
        try {
            if (data == null || horario == null) return null;
            return LocalDateTime.of(LocalDate.parse(data), LocalTime.parse(horario));
        } catch (RuntimeException e) {
            return null;
        }
    }

    public Long getQuadraId() { return quadraId; }
    public void setQuadraId(Long quadraId) { this.quadraId = quadraId; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public Integer getVagasTotais() { return vagasTotais; }
    public void setVagasTotais(Integer vagasTotais) { this.vagasTotais = vagasTotais; }
    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }
}
