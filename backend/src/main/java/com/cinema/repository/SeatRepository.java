package com.cinema.repository;

import com.cinema.entity.Screen;
import com.cinema.entity.Seat;
import com.cinema.entity.Seat.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    
    List<Seat> findByScreenId(Long screenId);
    
    List<Seat> findByScreenIdAndStatus(Long screenId, SeatStatus status);
    
        @Query("SELECT s FROM Seat s WHERE s.screen.id = :screenId AND s.seatRow = :seatRow AND s.seatNumber = :seatNumber")
    Optional<Seat> findByScreenIdAndPosition(@Param("screenId") Long screenId, @Param("seatRow") Integer seatRow, @Param("seatNumber") Integer seatNumber);
    
    @Query("SELECT s FROM Seat s WHERE s.screen.id = :screenId AND s.status = 'BLOCKED' AND s.blockedUntil < :now")
    List<Seat> findExpiredBlockedSeats(@Param("screenId") Long screenId, @Param("now") LocalDateTime now);
    
    @Modifying
    @Query("UPDATE Seat s SET s.status = 'AVAILABLE', s.blockedByUser = null, s.blockedUntil = null WHERE s.id IN :seatIds")
    void unblockSeats(@Param("seatIds") List<Long> seatIds);
    
    @Query("SELECT s FROM Seat s WHERE s.booking.id = :bookingId")
    List<Seat> findByBookingId(@Param("bookingId") Long bookingId);
    
    long countByScreen(Screen screen);
}
