package com.cinema.controller;

import com.cinema.dto.SeatBlockRequest;
import com.cinema.dto.SeatDto;
import com.cinema.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {
    
    private final SeatService seatService;
    
    @GetMapping("/screen/{screenId}")
    public ResponseEntity<List<SeatDto>> getSeatsByScreenId(@PathVariable Long screenId) {
        List<SeatDto> seats = seatService.getSeatsByScreenId(screenId);
        return ResponseEntity.ok(seats);
    }
    
    @PostMapping("/block")
    public ResponseEntity<List<SeatDto>> blockSeats(@Valid @RequestBody SeatBlockRequest request) {
        List<SeatDto> blockedSeats = seatService.blockSeats(request);
        return ResponseEntity.ok(blockedSeats);
    }
    
    @PostMapping("/unblock")
    public ResponseEntity<Void> unblockSeats(@RequestBody List<Long> seatIds) {
        seatService.unblockSeats(seatIds);
        return ResponseEntity.ok().build();
    }
}
