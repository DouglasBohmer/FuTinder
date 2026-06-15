package com.org.calolicasc.dto;

import jakarta.validation.constraints.NotBlank;

public class PerfilRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    private String cidade;
    private String estado;
    private String posicao;
    private String preferencias;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getPosicao() { return posicao; }
    public void setPosicao(String posicao) { this.posicao = posicao; }
    public String getPreferencias() { return preferencias; }
    public void setPreferencias(String preferencias) { this.preferencias = preferencias; }
}
