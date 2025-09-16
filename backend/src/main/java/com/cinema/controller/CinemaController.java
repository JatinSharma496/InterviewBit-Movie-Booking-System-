package com.cinema.controller;

import com.cinema.dto.CinemaDto;
import com.cinema.dto.MovieDto;
import com.cinema.service.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cinemas")
@RequiredArgsConstructor
public class CinemaController {
    
    private final CinemaService cinemaService;
    
    @GetMapping
    public ResponseEntity<List<CinemaDto>> getAllCinemas() {
        List<CinemaDto> cinemas = cinemaService.getAllCinemas();
        return ResponseEntity.ok(cinemas);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CinemaDto> getCinemaById(@PathVariable Long id) {
        CinemaDto cinema = cinemaService.getCinemaById(id);
        return ResponseEntity.ok(cinema);
    }
    
    @GetMapping("/{id}/movies")
    public ResponseEntity<List<MovieDto>> getMoviesByCinemaId(@PathVariable Long id) {
        List<MovieDto> movies = cinemaService.getMoviesByCinemaId(id);
        return ResponseEntity.ok(movies);
    }

    @PostMapping
    public ResponseEntity<CinemaDto> createCinema(@RequestBody CinemaDto cinemaDto) {
        CinemaDto createdCinema = cinemaService.createCinema(cinemaDto);
        return new ResponseEntity<>(createdCinema, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CinemaDto> updateCinema(@PathVariable Long id, @RequestBody CinemaDto cinemaDto) {
        CinemaDto updatedCinema = cinemaService.updateCinema(id, cinemaDto);
        return ResponseEntity.ok(updatedCinema);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCinema(@PathVariable Long id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.noContent().build();
    }
}