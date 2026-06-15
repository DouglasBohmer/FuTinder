package com.org.calolicasc.repository;

import com.org.calolicasc.model.Partida;
import com.org.calolicasc.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PartidaRepository extends JpaRepository<Partida, Long> {
    List<Partida> findByPublicaTrueAndCanceladaFalseAndVagasDisponiveisGreaterThan(Integer vagas);
    boolean existsByQuadraIdAndDataHoraAndCanceladaFalse(Long quadraId, LocalDateTime dataHora);
    boolean existsByQuadraIdAndDataHoraAndCanceladaFalseAndIdNot(Long quadraId, LocalDateTime dataHora, Long id);
    List<Partida> findByOrganizador(Usuario organizador);
    Optional<Partida> findByLinkConvite(String linkConvite);
}
