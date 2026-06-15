package com.org.calolicasc.dto;

import jakarta.validation.constraints.NotBlank;

public class FotoRequest {

    @NotBlank(message = "Foto é obrigatória")
    private String foto;

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
}
