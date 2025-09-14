package com.cinema.config;

import com.cinema.entity.*;
import com.cinema.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CinemaRepository cinemaRepository;
    private final ScreenRepository screenRepository;
    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;

    @Override
    public void run(String... args) {
        initializeData();
    }

    private void initializeData() {
        // ✅ Users
        User admin = createUserIfNotExists("admin@cinema.com", "Admin User", "1234567890", true);
        User user1 = createUserIfNotExists("john@example.com", "John Doe", "9876543210", false);

        // ✅ Cinemas
        Cinema cinema1 = createCinemaIfNotExists("CineMax Downtown", "123 Main Street, Downtown", "+1-555-0123");
        Cinema cinema2 = createCinemaIfNotExists("MegaPlex Mall", "456 Mall Road, Shopping District", "+1-555-0456");

        // ✅ Screens
        Screen screen1 = createScreenIfNotExists("Screen 1", 100, 10, 10, cinema1);
        Screen screen2 = createScreenIfNotExists("Screen 2", 80, 8, 10, cinema1);
        Screen screen3 = createScreenIfNotExists("Screen A", 120, 12, 10, cinema2);
        Screen screen4 = createScreenIfNotExists("Screen B", 90, 9, 10, cinema2);

        // ✅ Movies
        Movie movie1 = createMovieIfNotExists(
                "The Dark Knight",
                "When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must face the ultimate test.",
                "Action, Crime, Drama", "PG-13", 152,
                LocalDate.of(2008, 7, 18),
                "https://via.placeholder.com/300x450/000000/FFFFFF?text=The+Dark+Knight",
                cinema1
        );

        Movie movie2 = createMovieIfNotExists(
                "Inception",
                "A thief who steals corporate secrets through dream-sharing technology is tasked with planting an idea.",
                "Action, Sci-Fi, Thriller", "PG-13", 148,
                LocalDate.of(2010, 7, 16),
                "https://via.placeholder.com/300x450/000080/FFFFFF?text=Inception",
                cinema1
        );

        Movie movie3 = createMovieIfNotExists(
                "Avatar",
                "A paraplegic marine on Pandora becomes torn between following orders and protecting his new world.",
                "Action, Adventure, Fantasy", "PG-13", 162,
                LocalDate.of(2009, 12, 18),
                "https://via.placeholder.com/300x450/008000/FFFFFF?text=Avatar",
                cinema2
        );

        // ✅ Shows
        createShowIfNotExists(movie1, screen1, LocalDate.now().plusDays(1), LocalTime.of(10, 0), 15.0);
        createShowIfNotExists(movie1, screen1, LocalDate.now().plusDays(1), LocalTime.of(14, 0), 15.0);
        createShowIfNotExists(movie1, screen2, LocalDate.now().plusDays(1), LocalTime.of(18, 0), 15.0);

        createShowIfNotExists(movie2, screen2, LocalDate.now().plusDays(1), LocalTime.of(11, 0), 15.0);
        createShowIfNotExists(movie2, screen1, LocalDate.now().plusDays(1), LocalTime.of(15, 0), 15.0);
        createShowIfNotExists(movie2, screen2, LocalDate.now().plusDays(1), LocalTime.of(19, 0), 15.0);

        createShowIfNotExists(movie3, screen3, LocalDate.now().plusDays(1), LocalTime.of(12, 0), 15.0);
        createShowIfNotExists(movie3, screen3, LocalDate.now().plusDays(1), LocalTime.of(16, 0), 15.0);
        createShowIfNotExists(movie3, screen4, LocalDate.now().plusDays(1), LocalTime.of(20, 0), 15.0);

        // ✅ Seats
        createSeatsForScreen(screen1);
        createSeatsForScreen(screen2);
        createSeatsForScreen(screen3);
        createSeatsForScreen(screen4);
    }

    // ----------------- HELPERS -----------------

    private User createUserIfNotExists(String email, String name, String phone, boolean isAdmin) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setName(name);
            u.setPhoneNumber(phone);
            u.setIsAdmin(isAdmin);
            return userRepository.save(u);
        });
    }

    private Cinema createCinemaIfNotExists(String name, String location, String contact) {
        return cinemaRepository.findByName(name).orElseGet(() -> {
            Cinema c = new Cinema();
            c.setName(name);
            c.setLocation(location);
            c.setContactInfo(contact);
            return cinemaRepository.save(c);
        });
    }

    private Screen createScreenIfNotExists(String name, int capacity, int rows, int seatsPerRow, Cinema cinema) {
        return screenRepository.findByNameAndCinema(name, cinema).orElseGet(() -> {
            Screen s = new Screen();
            s.setName(name);
            s.setCapacity(capacity);
            s.setTotalRows(rows);
            s.setSeatsPerRow(seatsPerRow);
            s.setCinema(cinema);
            return screenRepository.save(s);
        });
    }

    private Movie createMovieIfNotExists(String title, String desc, String genre, String rating,
                                         int duration, LocalDate release, String posterUrl, Cinema cinema) {
        return movieRepository.findByTitle(title).orElseGet(() -> {
            Movie m = new Movie();
            m.setTitle(title);
            m.setDescription(desc);
            m.setGenre(genre);
            m.setRating(rating);
            m.setDuration(duration);
            m.setReleaseDate(release);
            m.setPosterUrl(posterUrl);
            m.setIsActive(true);
            m.setCinema(cinema);
            return movieRepository.save(m);
        });
    }

    private Show createShowIfNotExists(Movie movie, Screen screen, LocalDate date, LocalTime time, double price) {
        return showRepository.findByMovieAndScreenAndDateAndTime(movie, screen, date, time).orElseGet(() -> {
            Show s = new Show();
            s.setDate(date);
            s.setTime(time);
            s.setTicketPrice(price);
            s.setIsActive(true);
            s.setMovie(movie);
            s.setScreen(screen);
            return showRepository.save(s);
        });
    }

    private void createSeatsForScreen(Screen screen) {
        if (seatRepository.countByScreen(screen) > 0) return; // prevent duplicates

        for (int row = 1; row <= screen.getTotalRows(); row++) {
            for (int seatNum = 1; seatNum <= screen.getSeatsPerRow(); seatNum++) {
                Seat seat = new Seat();
                seat.setSeatRow(row);
                seat.setSeatNumber(seatNum);
                seat.setSeatCode(String.format("%c%d", 'A' + row - 1, seatNum));
                seat.setStatus(Seat.SeatStatus.AVAILABLE);
                seat.setScreen(screen);
                seatRepository.save(seat);
            }
        }
    }
}
