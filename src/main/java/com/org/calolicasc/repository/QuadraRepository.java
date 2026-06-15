package com.org.calolicasc.repository;

import com.org.calolicasc.model.Quadra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuadraRepository extends JpaRepository<Quadra, Long> {
}
