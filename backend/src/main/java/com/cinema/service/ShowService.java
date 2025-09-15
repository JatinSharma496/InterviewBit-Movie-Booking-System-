package com.cinema.service;

import com.cinema.dto.ShowDto;
import com.cinema.entity.Movie;
import com.cinema.entity.Screen;
import com.cinema.entity.Show;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.ScreenRepository;
import com.cinema.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ShowService {

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;

    public ShowDto getShowById(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found with id: " + id));
        return convertToDto(show);
    }

    @Transactional(readOnly = true)
    public List<ShowDto> getAllShows() {
        return showRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ShowDto> getShowsByMovieId(Long movieId) {
        return showRepository.findByMovieId(movieId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ShowDto createShow(ShowDto showDto) {
        Movie movie = movieRepository.findById(showDto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + showDto.getMovieId()));
        Screen screen = screenRepository.findById(showDto.getScreenId())
                .orElseThrow(() -> new RuntimeException("Screen not found with id: " + showDto.getScreenId()));

        // Movies are now independent entities that can be shown in any cinema
        // The cinema association is through the screen

        // Validate show date is not before movie release date
        if (movie.getReleaseDate() != null && showDto.getDate().isBefore(movie.getReleaseDate())) {
            throw new RuntimeException("Show cannot be scheduled before movie release date. " +
                    "Movie release date: " + movie.getReleaseDate() + 
                    ", Show date: " + showDto.getDate());
        }

        // Validate show date is not today or in the past (must be tomorrow or future)
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        if (showDto.getDate().isBefore(tomorrow)) {
            throw new RuntimeException("Show cannot be scheduled for today or in the past. " +
                    "Show date: " + showDto.getDate() + 
                    ", Earliest allowed date: " + tomorrow);
        }

        // Validate no time conflicts on the same screen
        validateNoTimeConflicts(showDto.getScreenId(), showDto.getDate(), showDto.getTime(), 
                              movie.getDuration(), null);

        Show show = new Show();
        show.setDate(showDto.getDate());
        show.setTime(showDto.getTime());
        show.setTicketPrice(showDto.getTicketPrice());
        show.setIsActive(showDto.getIsActive());
        show.setMovie(movie);
        show.setScreen(screen);

        Show savedShow = showRepository.save(show);
        return convertToDto(savedShow);
    }

    @Transactional
    public ShowDto updateShow(Long id, ShowDto showDto) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found with id: " + id));

        Movie movie = movieRepository.findById(showDto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + showDto.getMovieId()));
        Screen screen = screenRepository.findById(showDto.getScreenId())
                .orElseThrow(() -> new RuntimeException("Screen not found with id: " + showDto.getScreenId()));

        // Movies are now independent entities that can be shown in any cinema
        // The cinema association is through the screen

        // Validate show date is not before movie release date
        if (movie.getReleaseDate() != null && showDto.getDate().isBefore(movie.getReleaseDate())) {
            throw new RuntimeException("Show cannot be scheduled before movie release date. " +
                    "Movie release date: " + movie.getReleaseDate() + 
                    ", Show date: " + showDto.getDate());
        }

        // Validate show date is not today or in the past (must be tomorrow or future)
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        if (showDto.getDate().isBefore(tomorrow)) {
            throw new RuntimeException("Show cannot be scheduled for today or in the past. " +
                    "Show date: " + showDto.getDate() + 
                    ", Earliest allowed date: " + tomorrow);
        }

        // Validate no time conflicts on the same screen (excluding current show)
        validateNoTimeConflicts(showDto.getScreenId(), showDto.getDate(), showDto.getTime(), 
                              movie.getDuration(), id);

        show.setDate(showDto.getDate());
        show.setTime(showDto.getTime());
        show.setTicketPrice(showDto.getTicketPrice());
        show.setIsActive(showDto.getIsActive());
        show.setMovie(movie);
        show.setScreen(screen);

        Show updatedShow = showRepository.save(show);
        return convertToDto(updatedShow);
    }

    @Transactional
    public void deleteShow(Long id) {
        showRepository.deleteById(id);
    }

    @Transactional
    public void deleteShowsByMovieId(Long movieId) {
        List<Show> shows = showRepository.findAllByMovieId(movieId);
        showRepository.deleteAll(shows);
    }

    @Transactional
    public void deleteShowsByCinemaId(Long cinemaId) {
        List<Show> shows = showRepository.findAllByCinemaId(cinemaId);
        showRepository.deleteAll(shows);
    }

    private void validateNoTimeConflicts(Long screenId, java.time.LocalDate date, LocalTime startTime, 
                                       Integer durationMinutes, Long excludeShowId) {
        LocalTime endTime = startTime.plusMinutes(durationMinutes);
        
        List<Show> existingShows;
        if (excludeShowId != null) {
            existingShows = showRepository.findShowsByScreenAndDateExcluding(screenId, date, excludeShowId);
        } else {
            existingShows = showRepository.findShowsByScreenAndDate(screenId, date);
        }
        
        for (Show existingShow : existingShows) {
            LocalTime existingStartTime = existingShow.getTime();
            LocalTime existingEndTime = existingStartTime.plusMinutes(existingShow.getMovie().getDuration());
            
            // Check for time overlap
            if (isTimeOverlapping(startTime, endTime, existingStartTime, existingEndTime)) {
                throw new RuntimeException("Time conflict detected! Another show '" + existingShow.getMovie().getTitle() + 
                        "' is already scheduled on this screen from " + existingStartTime + 
                        " to " + existingEndTime + " on " + existingShow.getDate());
            }
        }
    }
    
    private boolean isTimeOverlapping(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        // Two time ranges overlap if one starts before the other ends and vice versa
        return start1.isBefore(end2) && start2.isBefore(end1);
    }

    private ShowDto convertToDto(Show show) {
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
        dto.setCinemaId(show.getScreen().getCinema().getId());
        dto.setCinemaName(show.getScreen().getCinema().getName());
        dto.setCinemaLocation(show.getScreen().getCinema().getLocation());
        dto.setCinemaContactInfo(show.getScreen().getCinema().getContactInfo());
        return dto;
    }
}
