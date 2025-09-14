package com.cinema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.cinema.entity.Seat.SeatStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatDto {
    
    private Long id;
    private Integer seatRow;
    private Integer seatNumber;
    private String seatCode;
    private SeatStatus status;
    private Long screenId;
    private Long bookingId;
    private Long blockedByUserId;
    private String blockedByUserName;
    private java.time.LocalDateTime blockedUntil;
}
