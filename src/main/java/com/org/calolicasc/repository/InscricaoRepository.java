package com.org.calolicasc.repository;

import com.org.calolicasc.model.Inscricao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {
    List<Inscricao> findByPartidaId(Long partidaId);
    List<Inscricao> findByUsuarioId(Long usuarioId);
    boolean existsByPartidaIdAndUsuarioId(Long partidaId, Long usuarioId);
    Optional<Inscricao> findByPartidaIdAndUsuarioId(Long partidaId, Long usuarioId);
    List<Inscricao> findByPartidaIdAndStatus(Long partidaId, String status);
    long countByPartidaIdAndStatus(Long partidaId, String status);
}
