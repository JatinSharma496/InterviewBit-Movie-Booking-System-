package com.cinema.service;

import com.cinema.dto.ScreenDto;
import com.cinema.entity.Cinema;
import com.cinema.entity.Screen;
import com.cinema.entity.Seat;
import com.cinema.repository.CinemaRepository;
import com.cinema.repository.ScreenRepository;
import com.cinema.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScreenService {

    private final ScreenRepository screenRepository;
    private final CinemaRepository cinemaRepository;
    private final SeatRepository seatRepository;

    public List<ScreenDto> getAllScreens() {
        return screenRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ScreenDto getScreenById(Long id) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Screen not found with id: " + id));
        return convertToDto(screen);
    }

    @Transactional
    public ScreenDto createScreen(ScreenDto screenDto) {
        Cinema cinema = cinemaRepository.findById(screenDto.getCinemaId())
                .orElseThrow(() -> new RuntimeException("Cinema not found with id: " + screenDto.getCinemaId()));

        Screen screen = new Screen();
        screen.setName(screenDto.getName());
        screen.setCapacity(screenDto.getCapacity());
        screen.setTotalRows(screenDto.getTotalRows());
        screen.setSeatsPerRow(screenDto.getSeatsPerRow());
        screen.setCinema(cinema);

        Screen savedScreen = screenRepository.save(screen);
        
        // Create seats for the new screen
        createSeatsForScreen(savedScreen);
        
        return convertToDto(savedScreen);
    }

    @Transactional
    public ScreenDto updateScreen(Long id, ScreenDto screenDto) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Screen not found with id: " + id));

        screen.setName(screenDto.getName());
        screen.setCapacity(screenDto.getCapacity());
        screen.setTotalRows(screenDto.getTotalRows());
        screen.setSeatsPerRow(screenDto.getSeatsPerRow());

        Screen savedScreen = screenRepository.save(screen);
        return convertToDto(savedScreen);
    }

    @Transactional
    public void deleteScreen(Long id) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Screen not found with id: " + id));
        screenRepository.delete(screen);
    }

    private void createSeatsForScreen(Screen screen) {
        if (seatRepository.countByScreen(screen) > 0) return; // prevent duplicates

        for (int row = 1; row <= screen.getTotalRows(); row++) {
            for (int seatNum = 1; seatNum <= screen.getSeatsPerRow(); seatNum++) {
                Seat seat = new Seat();
                seat.setSeatRow(row);
                seat.setSeatNumber(seatNum);
                seat.setSeatCode(String.format("%c%d", 'A' + row - 1, seatNum));
                seat.setStatus(Seat.SeatStatus.AVAILABLE);
                seat.setScreen(screen);
                seatRepository.save(seat);
            }
        }
    }

    private ScreenDto convertToDto(Screen screen) {
        ScreenDto dto = new ScreenDto();
        dto.setId(screen.getId());
        dto.setName(screen.getName());
        dto.setCapacity(screen.getCapacity());
        dto.setTotalRows(screen.getTotalRows());
        dto.setSeatsPerRow(screen.getSeatsPerRow());
        dto.setCinemaId(screen.getCinema().getId());
        return dto;
    }
}
