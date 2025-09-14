package com.cinema.repository;

import com.cinema.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    
    List<Movie> findByCinemaIdAndIsActiveTrue(Long cinemaId);
    
    Optional<Movie> findByTitle(String title);
    
    @Query("SELECT m FROM Movie m LEFT JOIN FETCH m.shows WHERE m.id = :id")
    Optional<Movie> findByIdWithShows(@Param("id") Long id);
    
    @Query("SELECT m FROM Movie m LEFT JOIN FETCH m.shows s WHERE m.cinema.id = :cinemaId AND m.isActive = true")
    List<Movie> findByCinemaIdWithShows(@Param("cinemaId") Long cinemaId);
}
