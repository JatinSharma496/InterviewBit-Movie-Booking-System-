package com.cinema.repository;

import com.cinema.entity.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, Long> {
    
    Optional<Cinema> findByName(String name);
    
    @Query("SELECT DISTINCT c FROM Cinema c LEFT JOIN FETCH c.screens WHERE c.id = :id")
    Optional<Cinema> findByIdWithScreensAndMovies(@Param("id") Long id);
    
    @Query("SELECT DISTINCT c FROM Cinema c LEFT JOIN FETCH c.screens")
    List<Cinema> findAllWithScreensAndMovies();
}
