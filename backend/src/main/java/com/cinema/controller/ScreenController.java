package com.cinema.controller;

import com.cinema.dto.ScreenDto;
import com.cinema.service.ScreenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/{id}")
    public ResponseEntity<ScreenDto> getScreenById(@PathVariable Long id) {
        ScreenDto screen = screenService.getScreenById(id);
        return ResponseEntity.ok(screen);
    }

    @PostMapping
    public ResponseEntity<ScreenDto> createScreen(@RequestBody ScreenDto screenDto) {
        ScreenDto createdScreen = screenService.createScreen(screenDto);
        return new ResponseEntity<>(createdScreen, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScreenDto> updateScreen(@PathVariable Long id, @RequestBody ScreenDto screenDto) {
        ScreenDto updatedScreen = screenService.updateScreen(id, screenDto);
        return ResponseEntity.ok(updatedScreen);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScreen(@PathVariable Long id) {
        screenService.deleteScreen(id);
        return ResponseEntity.noContent().build();
    }
}
