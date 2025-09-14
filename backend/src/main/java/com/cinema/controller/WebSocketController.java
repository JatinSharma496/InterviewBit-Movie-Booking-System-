package com.cinema.controller;

import com.cinema.dto.SeatDto;
import com.cinema.dto.SeatBlockRequest;
import com.cinema.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    
    private final SeatService seatService;
    
    @MessageMapping("/seats/block")
    @SendTo("/topic/seats")
    public List<SeatDto> blockSeats(SeatBlockRequest request) {
        return seatService.blockSeats(request);
    }
    
    @MessageMapping("/seats/unblock")
    @SendTo("/topic/seats")
    public void unblockSeats(List<Long> seatIds) {
        seatService.unblockSeats(seatIds);
    }
}
