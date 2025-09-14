package com.cinema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Show ID is required")
    private Long showId;
    
    @NotNull(message = "Seats are required")
    @Size(min = 1, max = 6, message = "You can book between 1 and 6 seats")
    private List<Long> seatIds;
}
