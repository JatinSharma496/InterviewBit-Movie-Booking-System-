package com.cinema.service;

import com.cinema.dto.CinemaDto;
import com.cinema.dto.MovieDto;
import com.cinema.dto.ScreenDto;
import com.cinema.entity.Cinema;
import com.cinema.repository.CinemaRepository;
import com.cinema.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CinemaService {
    
    private final CinemaRepository cinemaRepository;
    private final MovieRepository movieRepository;
    private final ShowService showService;
    
    public List<CinemaDto> getAllCinemas() {
        return cinemaRepository.findAllWithScreensAndMovies().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public CinemaDto getCinemaById(Long id) {
        Cinema cinema = cinemaRepository.findByIdWithScreensAndMovies(id)
                .orElseThrow(() -> new RuntimeException("Cinema not found with id: " + id));
        return convertToDto(cinema);
    }
    
    public List<MovieDto> getMoviesByCinemaId(Long cinemaId) {
        // Movies are not directly associated with cinemas in this model
        // This method would need to be implemented differently based on business requirements
        return List.of();
    }

    @Transactional
    public CinemaDto createCinema(CinemaDto cinemaDto) {
        Cinema cinema = new Cinema();
        cinema.setName(cinemaDto.getName());
        cinema.setLocation(cinemaDto.getLocation());
        cinema.setContactInfo(cinemaDto.getContactInfo());
        Cinema savedCinema = cinemaRepository.save(cinema);
        return convertToDto(savedCinema);
    }

    @Transactional
    public CinemaDto updateCinema(Long id, CinemaDto cinemaDto) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cinema not found with id: " + id));

        cinema.setName(cinemaDto.getName());
        cinema.setLocation(cinemaDto.getLocation());
        cinema.setContactInfo(cinemaDto.getContactInfo());
        Cinema updatedCinema = cinemaRepository.save(cinema);
        return convertToDto(updatedCinema);
    }

    @Transactional
    public void deleteCinema(Long id) {
        // First delete all shows in this cinema
        showService.deleteShowsByCinemaId(id);
        // Then delete the cinema (screens and movies will be cascade deleted by JPA)
        cinemaRepository.deleteById(id);
    }
    
    private CinemaDto convertToDto(Cinema cinema) {
        CinemaDto dto = new CinemaDto();
        dto.setId(cinema.getId());
        dto.setName(cinema.getName());
        dto.setLocation(cinema.getLocation());
        dto.setContactInfo(cinema.getContactInfo());
        
        if (cinema.getScreens() != null) {
            dto.setScreens(cinema.getScreens().stream()
                    .map(this::convertScreenToDto)
                    .collect(Collectors.toList()));
        }
        
        // Movies are not directly associated with cinemas in this model
        // dto.setMovies() is not available in CinemaDto
        
        return dto;
    }
    
    private ScreenDto convertScreenToDto(com.cinema.entity.Screen screen) {
        ScreenDto dto = new ScreenDto();
        dto.setId(screen.getId());
        dto.setName(screen.getName());
        dto.setCapacity(screen.getCapacity());
        dto.setTotalRows(screen.getTotalRows());
        dto.setSeatsPerRow(screen.getSeatsPerRow());
        dto.setCinemaId(screen.getCinema().getId());
        return dto;
    }
    
    private MovieDto convertMovieToDto(com.cinema.entity.Movie movie) {
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
        // Movies don't have direct cinema relationship in this model
        return dto;
    }
}