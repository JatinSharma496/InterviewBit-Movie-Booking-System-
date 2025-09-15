package com.cinema.service;

import com.cinema.dto.SeatBlockRequest;
import com.cinema.dto.SeatDto;
import com.cinema.entity.Seat;
import com.cinema.entity.Show;
import com.cinema.entity.User;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.ShowRepository;
import com.cinema.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SeatService {
    
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final ShowRepository showRepository;
    
    public List<SeatDto> getSeatsByScreenId(Long screenId) {
        List<Seat> seats = seatRepository.findByScreenId(screenId);
        return seats.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<SeatDto> blockSeats(SeatBlockRequest request) {
        // Validate user exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));
        
        // Get seats and validate they are available
        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("Some seats not found");
        }
        
        for (Seat seat : seats) {
            if (seat.getStatus() != Seat.SeatStatus.AVAILABLE) {
                throw new RuntimeException("Seat " + seat.getSeatCode() + " is not available");
            }
        }
        
        // Block seats for 5 minutes
        LocalDateTime blockUntil = LocalDateTime.now().plusMinutes(5);
        for (Seat seat : seats) {
            seat.setStatus(Seat.SeatStatus.BLOCKED);
            seat.setBlockedByUser(user);
            seat.setBlockedUntil(blockUntil);
        }
        
        List<Seat> savedSeats = seatRepository.saveAll(seats);
        return savedSeats.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public void unblockSeats(List<Long> seatIds) {
        List<Seat> seats = seatRepository.findAllById(seatIds);
        for (Seat seat : seats) {
            if (seat.getStatus() == Seat.SeatStatus.BLOCKED) {
                seat.setStatus(Seat.SeatStatus.AVAILABLE);
                seat.setBlockedByUser(null);
                seat.setBlockedUntil(null);
            }
        }
        seatRepository.saveAll(seats);
    }
    
    @Scheduled(fixedRate = 60000) // Run every minute
    public void cleanupExpiredBlocks() {
        // Clean up expired seat blocks
        List<Seat> expiredSeats = seatRepository.findExpiredBlockedSeats(
                null, LocalDateTime.now());
        
        if (!expiredSeats.isEmpty()) {
            List<Long> seatIds = expiredSeats.stream()
                    .map(Seat::getId)
                    .collect(Collectors.toList());
            
            seatRepository.unblockSeats(seatIds);
        }
        
        // Deactivate shows that have passed their date
        LocalDate today = LocalDate.now();
        List<Show> expiredShows = showRepository.findActiveShowsBeforeDate(today);
        
        if (!expiredShows.isEmpty()) {
            for (Show show : expiredShows) {
                show.setIsActive(false);
            }
            showRepository.saveAll(expiredShows);
            System.out.println("Deactivated " + expiredShows.size() + " shows that have passed their date");
        }
    }
    
    private SeatDto convertToDto(Seat seat) {
        SeatDto dto = new SeatDto();
        dto.setId(seat.getId());
        dto.setSeatRow(seat.getSeatRow());
        dto.setSeatNumber(seat.getSeatNumber());
        dto.setSeatCode(seat.getSeatCode());
        dto.setStatus(seat.getStatus());
        dto.setScreenId(seat.getScreen().getId());
        dto.setBookingId(seat.getBooking() != null ? seat.getBooking().getId() : null);
        dto.setBlockedByUserId(seat.getBlockedByUser() != null ? seat.getBlockedByUser().getId() : null);
        dto.setBlockedByUserName(seat.getBlockedByUser() != null ? seat.getBlockedByUser().getName() : null);
        dto.setBlockedUntil(seat.getBlockedUntil());
        return dto;
    }
}
