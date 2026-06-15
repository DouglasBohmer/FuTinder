package com.org.calolicasc.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "partidas")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "quadra_id", nullable = false)
    private Quadra quadra;

    @ManyToOne
    @JoinColumn(name = "organizador_id", nullable = false)
    private Usuario organizador;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false)
    private Boolean publica;

    @Column(nullable = false)
    private Integer vagasTotais;

    @Column(nullable = false)
    private Integer vagasDisponiveis;

    @Column(unique = true)
    private String linkConvite;

    @Column
    private String nivel;

    @Column(nullable = false)
    private Boolean cancelada = false;

    @Version
    private Long version;

    public Partida() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Quadra getQuadra() { return quadra; }
    public void setQuadra(Quadra quadra) { this.quadra = quadra; }
    public Usuario getOrganizador() { return organizador; }
    public void setOrganizador(Usuario organizador) { this.organizador = organizador; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public Boolean getPublica() { return publica; }
    public void setPublica(Boolean publica) { this.publica = publica; }
    public Integer getVagasTotais() { return vagasTotais; }
    public void setVagasTotais(Integer vagasTotais) { this.vagasTotais = vagasTotais; }
    public Integer getVagasDisponiveis() { return vagasDisponiveis; }
    public void setVagasDisponiveis(Integer vagasDisponiveis) { this.vagasDisponiveis = vagasDisponiveis; }
    public String getLinkConvite() { return linkConvite; }
    public void setLinkConvite(String linkConvite) { this.linkConvite = linkConvite; }
    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }
    public Boolean getCancelada() { return cancelada; }
    public void setCancelada(Boolean cancelada) { this.cancelada = cancelada; }
    public Long getVersion() { return version; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Partida partida = (Partida) o;
        return Objects.equals(id, partida.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}
