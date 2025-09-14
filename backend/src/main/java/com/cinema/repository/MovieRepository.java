package com.cinema.repository;

import com.cinema.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    
    Optional<Movie> findByTitle(String title);
    
    @Query("SELECT m FROM Movie m LEFT JOIN FETCH m.shows WHERE m.id = :id")
    Optional<Movie> findByIdWithShows(@Param("id") Long id);
    
    // Cinema-related queries removed - movies no longer have direct cinema relationship
}
