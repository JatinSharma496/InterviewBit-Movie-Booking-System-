package com.cinema.service;

import com.cinema.dto.MovieDto;
import com.cinema.dto.ShowDto;
import com.cinema.entity.Movie;
import com.cinema.entity.Show;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieService {

    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;

    public List<MovieDto> getAllMovies() {
        return movieRepository.findAll().stream()
                .map(this::convertMovieToDto)
                .collect(Collectors.toList());
    }

    public MovieDto getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
        return convertMovieToDto(movie);
    }

    public List<ShowDto> getShowsByMovieId(Long movieId) {
        return showRepository.findByMovieId(movieId).stream()
                .map(this::convertShowToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MovieDto createMovie(MovieDto movieDto) {
        Movie movie = new Movie();
        movie.setTitle(movieDto.getTitle());
        movie.setDescription(movieDto.getDescription());
        movie.setGenre(movieDto.getGenre());
        movie.setRating(movieDto.getRating());
        movie.setDuration(movieDto.getDuration());
        movie.setReleaseDate(movieDto.getReleaseDate());
        movie.setPosterUrl(movieDto.getPosterUrl());
        movie.setIsActive(movieDto.getIsActive());
        // Cinema association would be handled here if needed
        Movie savedMovie = movieRepository.save(movie);
        return convertMovieToDto(savedMovie);
    }

    @Transactional
    public MovieDto updateMovie(Long id, MovieDto movieDto) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));

        movie.setTitle(movieDto.getTitle());
        movie.setDescription(movieDto.getDescription());
        movie.setGenre(movieDto.getGenre());
        movie.setRating(movieDto.getRating());
        movie.setDuration(movieDto.getDuration());
        movie.setReleaseDate(movieDto.getReleaseDate());
        movie.setPosterUrl(movieDto.getPosterUrl());
        movie.setIsActive(movieDto.getIsActive());

        Movie updatedMovie = movieRepository.save(movie);
        return convertMovieToDto(updatedMovie);
    }

    @Transactional
    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    private MovieDto convertMovieToDto(Movie movie) {
        MovieDto dto = new MovieDto();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setDescription(movie.getDescription());
        dto.setGenre(movie.getGenre());
        dto.setRating(movie.getRating());
        dto.setDuration(movie.getDuration());
        dto.setReleaseDate(movie.getReleaseDate());
        dto.setPosterUrl(movie.getPosterUrl());
        dto.setIsActive(movie.getIsActive());
        if (movie.getCinema() != null) {
            dto.setCinemaId(movie.getCinema().getId());
        }
        return dto;
    }

    private ShowDto convertShowToDto(Show show) {
        ShowDto dto = new ShowDto();
        dto.setId(show.getId());
        dto.setDate(show.getDate());
        dto.setTime(show.getTime());
        dto.setTicketPrice(show.getTicketPrice());
        dto.setIsActive(show.getIsActive());
        dto.setMovieId(show.getMovie().getId());
        dto.setMovieTitle(show.getMovie().getTitle());
        dto.setScreenId(show.getScreen().getId());
        dto.setScreenName(show.getScreen().getName());
        return dto;
    }
}
