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

    @Transactional
    public ShowDto createShow(ShowDto showDto) {
        Movie movie = movieRepository.findById(showDto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + showDto.getMovieId()));
        Screen screen = screenRepository.findById(showDto.getScreenId())
                .orElseThrow(() -> new RuntimeException("Screen not found with id: " + showDto.getScreenId()));

        // Validate that movie and screen belong to the same cinema
        if (!movie.getCinema().getId().equals(screen.getCinema().getId())) {
            throw new RuntimeException("Movie and screen must belong to the same cinema. " +
                    "Movie belongs to cinema: " + movie.getCinema().getName() + 
                    ", but screen belongs to cinema: " + screen.getCinema().getName());
        }

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

        // Validate that movie and screen belong to the same cinema
        if (!movie.getCinema().getId().equals(screen.getCinema().getId())) {
            throw new RuntimeException("Movie and screen must belong to the same cinema. " +
                    "Movie belongs to cinema: " + movie.getCinema().getName() + 
                    ", but screen belongs to cinema: " + screen.getCinema().getName());
        }

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
        return dto;
    }
}
