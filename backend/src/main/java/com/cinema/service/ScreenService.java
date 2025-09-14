package com.cinema.service;

import com.cinema.dto.ScreenDto;
import com.cinema.entity.Screen;
import com.cinema.repository.ScreenRepository;
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

    public List<ScreenDto> getAllScreens() {
        return screenRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
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
