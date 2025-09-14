package com.cinema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScreenDto {
    
    private Long id;
    
    @NotBlank(message = "Screen name is required")
    private String name;
    
    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;
    
    private Integer totalRows = 10;
    private Integer seatsPerRow = 10;
    
    private Long cinemaId;
}
