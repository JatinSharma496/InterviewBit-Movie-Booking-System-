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
    
    @Query("SELECT DISTINCT s FROM Show s LEFT JOIN FETCH s.movie m LEFT JOIN FETCH s.screen sc WHERE s.screen.cinema.id = :cinemaId AND s.isActive = true")
    List<Show> findByCinemaIdWithMovieAndScreen(@Param("cinemaId") Long cinemaId);
    
    // Get all shows on a specific screen and date for conflict checking
    @Query("SELECT s FROM Show s LEFT JOIN FETCH s.movie WHERE s.screen.id = :screenId AND s.date = :date AND s.isActive = true")
    List<Show> findShowsByScreenAndDate(@Param("screenId") Long screenId, @Param("date") LocalDate date);
    
    // Get all shows on a specific screen and date excluding a specific show (for updates)
    @Query("SELECT s FROM Show s LEFT JOIN FETCH s.movie WHERE s.screen.id = :screenId AND s.date = :date AND s.isActive = true AND s.id != :excludeShowId")
    List<Show> findShowsByScreenAndDateExcluding(@Param("screenId") Long screenId, @Param("date") LocalDate date, @Param("excludeShowId") Long excludeShowId);
    
    // Find all shows for a specific movie (for cascade delete)
    @Query("SELECT s FROM Show s WHERE s.movie.id = :movieId")
    List<Show> findAllByMovieId(@Param("movieId") Long movieId);
    
    // Find all shows for screens in a specific cinema (for cascade delete)
    @Query("SELECT s FROM Show s WHERE s.screen.cinema.id = :cinemaId")
    List<Show> findAllByCinemaId(@Param("cinemaId") Long cinemaId);
    
    // Find all shows for a specific screen (for cascade delete)
    @Query("SELECT s FROM Show s WHERE s.screen.id = :screenId")
    List<Show> findByScreenId(@Param("screenId") Long screenId);
    
    // Find all active shows that have passed their date (for automatic deactivation)
    @Query("SELECT s FROM Show s WHERE s.isActive = true AND s.date < :currentDate")
    List<Show> findActiveShowsBeforeDate(@Param("currentDate") LocalDate currentDate);
}