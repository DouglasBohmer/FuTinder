package com.org.calolicasc.config;

import com.org.calolicasc.model.*;
import com.org.calolicasc.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final QuadraRepository quadraRepository;

    public DataInitializer(UsuarioRepository usuarioRepository, QuadraRepository quadraRepository) {
        this.usuarioRepository = usuarioRepository;
        this.quadraRepository = quadraRepository;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) return;

        Usuario admin = new Usuario();
        admin.setNome("Admin");
        admin.setEmail("admin");
        admin.setSenha("admin");
        admin.setCidade("São Paulo, SP");
        admin.setPosicao("Atacante");
        usuarioRepository.save(admin);

        Quadra arena = new Quadra();
        arena.setNome("Arena Sports Center"); arena.setEndereco("Av. Paulista, 1000 - São Paulo");
        arena.setTipo("Society"); arena.setCapacidade(10); arena.setPreco(200.0); arena.setEmoji("🏟️");
        quadraRepository.save(arena);

        Quadra parque = new Quadra();
        parque.setNome("Quadra do Parque"); parque.setEndereco("Rua das Flores, 500 - São Paulo");
        parque.setTipo("Society"); parque.setCapacidade(10); parque.setPreco(150.0); parque.setEmoji("⚽");
        quadraRepository.save(parque);

        Quadra central = new Quadra();
        central.setNome("Esporte Clube Central"); central.setEndereco("Av. Central, 2000 - São Paulo");
        central.setTipo("Campo"); central.setCapacidade(22); central.setPreco(350.0); central.setEmoji("🏆");
        quadraRepository.save(central);

        Quadra municipal = new Quadra();
        municipal.setNome("Quadra Municipal"); municipal.setEndereco("Rua do Esporte, 300 - São Paulo");
        municipal.setTipo("Society"); municipal.setCapacidade(10); municipal.setPreco(120.0); municipal.setEmoji("🎯");
        quadraRepository.save(municipal);
    }
}
