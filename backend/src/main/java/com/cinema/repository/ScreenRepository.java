package com.cinema.repository;

import com.cinema.entity.Cinema;
import com.cinema.entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScreenRepository extends JpaRepository<Screen, Long> {
    
    List<Screen> findByCinemaId(Long cinemaId);
    
    Optional<Screen> findByNameAndCinema(String name, Cinema cinema);
    
    @Query("SELECT s FROM Screen s LEFT JOIN FETCH s.seats WHERE s.id = :id")
    Optional<Screen> findByIdWithSeats(@Param("id") Long id);
}
