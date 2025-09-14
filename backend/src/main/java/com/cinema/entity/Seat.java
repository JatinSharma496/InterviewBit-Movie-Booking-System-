package com.cinema.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
        @Column(name = "seat_row", nullable = false)
    private Integer seatRow;
    
    @Column(nullable = false)
    private Integer seatNumber;
    
    @Column(name = "seat_code")
    private String seatCode; // e.g., "A1", "B5"
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status = SeatStatus.AVAILABLE;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocked_by_user_id")
    private User blockedByUser;
    
    @Column(name = "blocked_until")
    private java.time.LocalDateTime blockedUntil;
    
    public enum SeatStatus {
        AVAILABLE, BOOKED, BLOCKED
    }
}
