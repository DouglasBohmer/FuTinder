package com.org.calolicasc.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {
        "/",
        "/login",
        "/cadastro",
        "/reserva",
        "/jogos-publicos",
        "/match",
        "/minhas-reservas",
        "/quadras-admin",
        "/perfil",
        "/notificacoes",
        "/configuracoes",
        "/partida/{id:[0-9]+}",
        "/partida/{id:[0-9]+}/convite",
        "/convite/{token}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
