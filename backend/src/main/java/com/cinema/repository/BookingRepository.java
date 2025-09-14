package com.cinema.repository;

import com.cinema.entity.Booking;
import com.cinema.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserIdOrderByBookingDateDesc(Long userId);
    
    List<Booking> findByUserIdAndStatusOrderByBookingDateDesc(Long userId, BookingStatus status);
    
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.seats s LEFT JOIN FETCH b.user u LEFT JOIN FETCH b.show sh LEFT JOIN FETCH sh.movie m LEFT JOIN FETCH sh.screen sc WHERE b.id = :id")
    Optional<Booking> findByIdWithDetails(@Param("id") Long id);
    
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.seats s LEFT JOIN FETCH b.user u LEFT JOIN FETCH b.show sh LEFT JOIN FETCH sh.movie m LEFT JOIN FETCH sh.screen sc WHERE b.user.id = :userId ORDER BY b.bookingDate DESC")
    List<Booking> findByUserIdWithDetails(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.show.id = :showId AND b.status = 'CONFIRMED'")
    Long countConfirmedBookingsByShowId(@Param("showId") Long showId);
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDate >= :startDate AND b.bookingDate <= :endDate")
    List<Booking> findBookingsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
