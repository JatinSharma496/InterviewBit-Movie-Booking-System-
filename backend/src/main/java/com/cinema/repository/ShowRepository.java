package com.cinema.repository;

import com.cinema.entity.Movie;
import com.cinema.entity.Screen;
import com.cinema.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {
    
    @Query("SELECT s FROM Show s LEFT JOIN FETCH s.movie m LEFT JOIN FETCH s.screen sc WHERE m.id = :movieId AND s.isActive = true")
    List<Show> findByMovieId(@Param("movieId") Long movieId);
    
    List<Show> findByScreenIdAndDateAndIsActiveTrue(Long screenId, LocalDate date);
    
    Optional<Show> findByMovieAndScreenAndDateAndTime(Movie movie, Screen screen, LocalDate date, LocalTime time);
    
    @Query("SELECT s FROM Show s LEFT JOIN FETCH s.bookings b LEFT JOIN FETCH b.seats WHERE s.id = :id")
    Optional<Show> findByIdWithBookingsAndSeats(@Param("id") Long id);
    
    @Query("SELECT DISTINCT s FROM Show s LEFT JOIN FETCH s.movie m LEFT JOIN FETCH s.screen sc WHERE s.movie.cinema.id = :cinemaId AND s.isActive = true")
    List<Show> findByCinemaIdWithMovieAndScreen(@Param("cinemaId") Long cinemaId);
}