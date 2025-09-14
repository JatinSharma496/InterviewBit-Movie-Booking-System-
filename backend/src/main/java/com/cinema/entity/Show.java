package com.cinema.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "shows", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"screen_id", "date", "time"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Show {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(nullable = false)
    private LocalTime time;
    
    @Column(name = "ticket_price")
    private Double ticketPrice = 15.0;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;
    
    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings;
}
