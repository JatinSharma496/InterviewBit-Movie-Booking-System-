package com.cinema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowDto {
    
    private Long id;
    
    @NotNull(message = "Show date is required")
    private LocalDate date;
    
    @NotNull(message = "Show time is required")
    private LocalTime time;
    
    @Positive(message = "Ticket price must be positive")
    private Double ticketPrice = 15.0;
    
    private Boolean isActive = true;
    
    private Long movieId;
    private Long screenId;
    
    private MovieDto movie;
    private ScreenDto screen;
    private String movieTitle;
    private String screenName;
    private Long cinemaId;
    private String cinemaName;
    private String cinemaLocation;
    private String cinemaContactInfo;
}