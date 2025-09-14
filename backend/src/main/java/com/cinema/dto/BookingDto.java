package com.cinema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.cinema.entity.Booking.BookingStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    
    private Long id;
    private String bookingReference;
    
    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be positive")
    private Double totalAmount;
    
    private LocalDateTime bookingDate;
    private BookingStatus status;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Show ID is required")
    private Long showId;
    
    @NotNull(message = "Seats are required")
    @Size(min = 1, max = 6, message = "You can book between 1 and 6 seats")
    private List<Long> seatIds;
    
    private UserDto user;
    private ShowDto show;
    private List<SeatDto> seats;
}
