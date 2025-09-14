package com.cinema.controller;

import com.cinema.dto.MovieDto;
import com.cinema.dto.ShowDto;
import com.cinema.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<List<MovieDto>> getAllMovies() {
        try {
            List<MovieDto> movies = movieService.getAllMovies();
            System.out.println("Found " + movies.size() + " movies");
            return ResponseEntity.ok(movies);
        } catch (Exception e) {
            System.err.println("Error getting movies: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDto> getMovieById(@PathVariable Long id) {
        MovieDto movie = movieService.getMovieById(id);
        return ResponseEntity.ok(movie);
    }

    @GetMapping("/{movieId}/shows")
    public ResponseEntity<List<ShowDto>> getShowsByMovieId(@PathVariable Long movieId) {
        List<ShowDto> shows = movieService.getShowsByMovieId(movieId);
        return ResponseEntity.ok(shows);
    }

    @PostMapping
    public ResponseEntity<MovieDto> createMovie(@RequestBody MovieDto movieDto) {
        MovieDto createdMovie = movieService.createMovie(movieDto);
        return new ResponseEntity<>(createdMovie, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieDto> updateMovie(@PathVariable Long id, @RequestBody MovieDto movieDto) {
        MovieDto updatedMovie = movieService.updateMovie(id, movieDto);
        return ResponseEntity.ok(updatedMovie);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    // Cinema assignment endpoint removed - movies no longer tied to specific cinemas
}
