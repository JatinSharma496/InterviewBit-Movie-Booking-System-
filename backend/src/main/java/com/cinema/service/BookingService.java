package com.cinema.service;

import com.cinema.dto.BookingDto;
import com.cinema.dto.BookingRequest;
import com.cinema.dto.SeatDto;
import com.cinema.dto.UserDto;
import com.cinema.dto.ShowDto;
import com.cinema.dto.MovieDto;
import com.cinema.dto.ScreenDto;
import com.cinema.dto.CinemaDto;
import com.cinema.entity.*;
import com.cinema.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    
    public BookingDto createBooking(BookingRequest request) {
        // Validate user exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));
        
        // Validate show exists
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found with id: " + request.getShowId()));
        
        // Validate seats exist and are available
        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("Some seats not found");
        }
        
        for (Seat seat : seats) {
            // Allow AVAILABLE seats or BLOCKED seats that are blocked by the current user
            if (seat.getStatus() == Seat.SeatStatus.BOOKED) {
                throw new RuntimeException("Seat " + seat.getSeatCode() + " is already booked");
            }
            if (seat.getStatus() == Seat.SeatStatus.BLOCKED && 
                (seat.getBlockedByUser() == null || !seat.getBlockedByUser().getId().equals(request.getUserId()))) {
                throw new RuntimeException("Seat " + seat.getSeatCode() + " is blocked by another user");
            }
            if (!seat.getScreen().getId().equals(show.getScreen().getId())) {
                throw new RuntimeException("Seat " + seat.getSeatCode() + " does not belong to the show's screen");
            }
        }
        
        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShow(show);
        booking.setTotalAmount(seats.size() * show.getTicketPrice());
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Update seat status and assign to booking
        for (Seat seat : seats) {
            seat.setStatus(Seat.SeatStatus.BOOKED);
            seat.setBooking(savedBooking);
            seat.setBlockedByUser(null);
            seat.setBlockedUntil(null);
        }
        seatRepository.saveAll(seats);
        
        return convertToDto(savedBooking);
    }
    
    public BookingDto getBookingById(Long id) {
        Booking booking = bookingRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return convertToDto(booking);
    }
    
    public List<BookingDto> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserIdWithDetails(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public BookingDto cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
        
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed bookings can be cancelled");
        }
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        
        // Free up the seats
        for (Seat seat : booking.getSeats()) {
            seat.setStatus(Seat.SeatStatus.AVAILABLE);
            seat.setBooking(null);
            seat.setBlockedByUser(null);
            seat.setBlockedUntil(null);
        }
        seatRepository.saveAll(booking.getSeats());
        
        Booking savedBooking = bookingRepository.save(booking);
        return convertToDto(savedBooking);
    }
    
    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private BookingDto convertToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStatus(booking.getStatus());
        dto.setUserId(booking.getUser().getId());
        dto.setShowId(booking.getShow().getId());
        
        // Include user information
        if (booking.getUser() != null) {
            UserDto userDto = new UserDto();
            userDto.setId(booking.getUser().getId());
            userDto.setName(booking.getUser().getName());
            userDto.setEmail(booking.getUser().getEmail());
            userDto.setPhoneNumber(booking.getUser().getPhoneNumber());
            userDto.setIsAdmin(booking.getUser().getIsAdmin());
            dto.setUser(userDto);
        }
        
        // Include show information with movie, screen, and cinema details
        if (booking.getShow() != null) {
            ShowDto showDto = new ShowDto();
            showDto.setId(booking.getShow().getId());
            showDto.setDate(booking.getShow().getDate());
            showDto.setTime(booking.getShow().getTime());
            showDto.setTicketPrice(booking.getShow().getTicketPrice());
            showDto.setIsActive(booking.getShow().getIsActive());
            showDto.setMovieId(booking.getShow().getMovie().getId());
            showDto.setScreenId(booking.getShow().getScreen().getId());
            
            // Include movie details
            if (booking.getShow().getMovie() != null) {
                MovieDto movieDto = new MovieDto();
                movieDto.setId(booking.getShow().getMovie().getId());
                movieDto.setTitle(booking.getShow().getMovie().getTitle());
                movieDto.setDescription(booking.getShow().getMovie().getDescription());
                movieDto.setGenre(booking.getShow().getMovie().getGenre());
                movieDto.setRating(booking.getShow().getMovie().getRating());
                movieDto.setDuration(booking.getShow().getMovie().getDuration());
                movieDto.setReleaseDate(booking.getShow().getMovie().getReleaseDate());
                movieDto.setPosterUrl(booking.getShow().getMovie().getPosterUrl());
                movieDto.setIsActive(booking.getShow().getMovie().getIsActive());
                movieDto.setCinemaId(booking.getShow().getMovie().getCinema().getId());
                showDto.setMovie(movieDto);
                showDto.setMovieTitle(booking.getShow().getMovie().getTitle());
            }
            
            // Include screen details
            if (booking.getShow().getScreen() != null) {
                ScreenDto screenDto = new ScreenDto();
                screenDto.setId(booking.getShow().getScreen().getId());
                screenDto.setName(booking.getShow().getScreen().getName());
                screenDto.setCapacity(booking.getShow().getScreen().getCapacity());
                screenDto.setTotalRows(booking.getShow().getScreen().getTotalRows());
                screenDto.setSeatsPerRow(booking.getShow().getScreen().getSeatsPerRow());
                screenDto.setCinemaId(booking.getShow().getScreen().getCinema().getId());
                showDto.setScreen(screenDto);
                showDto.setScreenName(booking.getShow().getScreen().getName());
                
                // Include cinema details
                if (booking.getShow().getScreen().getCinema() != null) {
                    CinemaDto cinemaDto = new CinemaDto();
                    cinemaDto.setId(booking.getShow().getScreen().getCinema().getId());
                    cinemaDto.setName(booking.getShow().getScreen().getCinema().getName());
                    cinemaDto.setLocation(booking.getShow().getScreen().getCinema().getLocation());
                    cinemaDto.setContactInfo(booking.getShow().getScreen().getCinema().getContactInfo());
                    showDto.setCinemaId(booking.getShow().getScreen().getCinema().getId());
                    showDto.setCinemaName(booking.getShow().getScreen().getCinema().getName());
                    showDto.setCinemaLocation(booking.getShow().getScreen().getCinema().getLocation());
                    showDto.setCinemaContactInfo(booking.getShow().getScreen().getCinema().getContactInfo());
                }
            }
            
            dto.setShow(showDto);
        }
        
        if (booking.getSeats() != null) {
            dto.setSeatIds(booking.getSeats().stream()
                    .map(Seat::getId)
                    .collect(Collectors.toList()));
            
            dto.setSeats(booking.getSeats().stream()
                    .map(this::convertSeatToDto)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    private SeatDto convertSeatToDto(Seat seat) {
        SeatDto dto = new SeatDto();
        dto.setId(seat.getId());
        dto.setSeatRow(seat.getSeatRow());
        dto.setSeatNumber(seat.getSeatNumber());
        dto.setSeatCode(seat.getSeatCode());
        dto.setStatus(seat.getStatus());
        dto.setScreenId(seat.getScreen().getId());
        dto.setBookingId(seat.getBooking() != null ? seat.getBooking().getId() : null);
        dto.setBlockedByUserId(seat.getBlockedByUser() != null ? seat.getBlockedByUser().getId() : null);
        dto.setBlockedByUserName(seat.getBlockedByUser() != null ? seat.getBlockedByUser().getName() : null);
        dto.setBlockedUntil(seat.getBlockedUntil());
        return dto;
    }
}
