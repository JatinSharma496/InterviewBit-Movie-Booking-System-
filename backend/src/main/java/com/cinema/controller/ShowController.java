package com.cinema.controller;

import com.cinema.dto.ShowDto;
import com.cinema.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shows")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ShowController {

    private final ShowService showService;

    @GetMapping
    public ResponseEntity<List<ShowDto>> getAllShows() {
        List<ShowDto> shows = showService.getAllShows();
        return ResponseEntity.ok(shows);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShowDto> getShowById(@PathVariable Long id) {
        ShowDto show = showService.getShowById(id);
        return ResponseEntity.ok(show);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowDto>> getShowsByMovieId(@PathVariable Long movieId) {
        List<ShowDto> shows = showService.getShowsByMovieId(movieId);
        return ResponseEntity.ok(shows);
    }

    @PostMapping
    public ResponseEntity<?> createShow(@RequestBody ShowDto showDto) {
        try {
            ShowDto createdShow = showService.createShow(showDto);
            return new ResponseEntity<>(createdShow, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateShow(@PathVariable Long id, @RequestBody ShowDto showDto) {
        try {
            ShowDto updatedShow = showService.updateShow(id, showDto);
            return ResponseEntity.ok(updatedShow);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShow(@PathVariable Long id) {
        showService.deleteShow(id);
        return ResponseEntity.noContent().build();
    }
}
