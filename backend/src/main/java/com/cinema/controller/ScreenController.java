package com.cinema.controller;

import com.cinema.dto.ScreenDto;
import com.cinema.service.ScreenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/screens")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ScreenController {

    private final ScreenService screenService;

    @GetMapping
    public ResponseEntity<List<ScreenDto>> getAllScreens() {
        List<ScreenDto> screens = screenService.getAllScreens();
        return ResponseEntity.ok(screens);
    }
}
