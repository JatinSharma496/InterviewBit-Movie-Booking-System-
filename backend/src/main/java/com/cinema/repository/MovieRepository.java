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
    
    Optional<Movie> findByTitle(String title);
    
    @Query("SELECT m FROM Movie m LEFT JOIN FETCH m.shows WHERE m.id = :id")
    Optional<Movie> findByIdWithShows(@Param("id") Long id);
    
    // Find movies that have shows in screens belonging to a specific cinema
    @Query("SELECT DISTINCT m FROM Movie m JOIN m.shows s JOIN s.screen sc WHERE sc.cinema.id = :cinemaId")
    List<Movie> findMoviesByCinemaId(@Param("cinemaId") Long cinemaId);
}
