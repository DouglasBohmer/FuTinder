package com.org.calolicasc.repository;

import com.org.calolicasc.model.Partida;
import com.org.calolicasc.model.Quadra;
import com.org.calolicasc.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class PartidaRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private PartidaRepository partidaRepository;

    private Usuario organizador;
    private Quadra quadra;

    @BeforeEach
    public void setUp() {
        organizador = new Usuario();
        organizador.setNome("Douglas");
        organizador.setEmail("douglas@email.com");
        organizador.setSenha("senha123");
        entityManager.persist(organizador);

        quadra = new Quadra();
        quadra.setNome("Quadra Principal");
        quadra.setEndereco("Rua do Futebol, 10");
        entityManager.persist(quadra);
    }

    @Test
    public void deveSalvarPartidaComSucesso() {
        Partida partida = new Partida();
        partida.setNome("Pelada Teste");
        partida.setQuadra(quadra);
        partida.setOrganizador(organizador);
        partida.setDataHora(LocalDateTime.now().plusDays(2));
        partida.setPublica(true);
        partida.setVagasTotais(14);
        partida.setVagasDisponiveis(14);
        partida.setLinkConvite(UUID.randomUUID().toString().substring(0, 12));
        partida.setCancelada(false);

        Partida partidaSalva = partidaRepository.save(partida);

        assertThat(partidaSalva).isNotNull();
        assertThat(partidaSalva.getId()).isNotNull();
    }

    @Test
    public void deveEncontrarPartidasPublicasComVagasDisponiveis() {
        Partida partidaPublica = new Partida();
        partidaPublica.setNome("Pelada Publica");
        partidaPublica.setQuadra(quadra);
        partidaPublica.setOrganizador(organizador);
        partidaPublica.setDataHora(LocalDateTime.now().plusDays(1));
        partidaPublica.setPublica(true);
        partidaPublica.setVagasTotais(14);
        partidaPublica.setVagasDisponiveis(2);
        partidaPublica.setLinkConvite("link1");
        partidaPublica.setCancelada(false);

        Partida partidaFechada = new Partida();
        partidaFechada.setNome("Pelada Fechada");
        partidaFechada.setQuadra(quadra);
        partidaFechada.setOrganizador(organizador);
        partidaFechada.setDataHora(LocalDateTime.now().plusDays(2));
        partidaFechada.setPublica(false);
        partidaFechada.setVagasTotais(14);
        partidaFechada.setVagasDisponiveis(0);
        partidaFechada.setLinkConvite("link2");
        partidaFechada.setCancelada(false);

        entityManager.persist(partidaPublica);
        entityManager.persist(partidaFechada);

        List<Partida> partidas = partidaRepository.findByPublicaTrueAndCanceladaFalseAndVagasDisponiveisGreaterThan(0);

        assertThat(partidas).isNotEmpty();
        assertThat(partidas.size()).isEqualTo(1);
        assertThat(partidas.get(0).getPublica()).isTrue();
    }

    @Test
    public void deveRetornarVerdadeiroSeQuadraJaEstiverReservadaNoHorario() {
        LocalDateTime dataHoraReserva = LocalDateTime.now().plusDays(3);
        Partida partida = new Partida();
        partida.setNome("Pelada Reserva");
        partida.setQuadra(quadra);
        partida.setOrganizador(organizador);
        partida.setDataHora(dataHoraReserva);
        partida.setPublica(true);
        partida.setVagasTotais(10);
        partida.setVagasDisponiveis(10);
        partida.setLinkConvite("linktest");
        partida.setCancelada(false);
        entityManager.persist(partida);

        boolean existeReserva = partidaRepository.existsByQuadraIdAndDataHoraAndCanceladaFalse(quadra.getId(), dataHoraReserva);

        assertThat(existeReserva).isTrue();
    }
}
