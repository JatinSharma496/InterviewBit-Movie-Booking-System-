package com.cinema.config;

import com.cinema.entity.*;
import com.cinema.repository.*;
import com.cinema.util.PasswordUtil;
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
        migrateExistingPasswords();
        initializeData();
    }

    private void migrateExistingPasswords() {
        // Migrate existing users with plain text passwords to hashed passwords
        userRepository.findAll().forEach(user -> {
            if (user.getPassword() != null && !user.getPassword().contains("=")) {
                // If password doesn't contain '=' it's likely plain text (Base64 contains '=')
                if (user.getPassword().equals("password123")) {
                    user.setPassword(PasswordUtil.hashPassword("password123"));
                    userRepository.save(user);
                    System.out.println("Migrated password for user: " + user.getEmail());
                }
            }
        });
    }

    private void initializeData() {
        System.out.println("Starting data initialization...");
        
        
        // ✅ Users
        User admin = createUserIfNotExists("admin@cinema.com", "Admin User", "1234567890", true);
        User user1 = createUserIfNotExists("john@example.com", "John Doe", "9876543210", false);
        System.out.println("Users created: " + admin.getEmail() + ", " + user1.getEmail());

        // ✅ Cinemas - Indian Cinema Names
        Cinema cinema1 = createCinemaIfNotExists("PVR Cinemas - Phoenix MarketCity", "Phoenix MarketCity, Whitefield, Bangalore", "+91-80-1234-5678");
        Cinema cinema2 = createCinemaIfNotExists("INOX Megaplex - Forum Mall", "Forum Mall, Koramangala, Bangalore", "+91-80-2345-6789");
        Cinema cinema3 = createCinemaIfNotExists("Cinepolis - Orion Mall", "Orion Mall, Rajajinagar, Bangalore", "+91-80-3456-7890");

        // ✅ Screens
        Screen screen1 = createScreenIfNotExists("Screen 1", 100, 10, 10, cinema1);
        Screen screen2 = createScreenIfNotExists("Screen 2", 80, 8, 10, cinema1);
        Screen screen3 = createScreenIfNotExists("Screen A", 120, 12, 10, cinema2);
        Screen screen4 = createScreenIfNotExists("Screen B", 90, 9, 10, cinema2);
        Screen screen5 = createScreenIfNotExists("Screen X", 110, 11, 10, cinema3);
        Screen screen6 = createScreenIfNotExists("Screen Y", 95, 9, 10, cinema3);

        // ✅ Movies - Upcoming Hindi and English Movies
        // Hindi Movies
        Movie movie1 = createMovieIfNotExists(
                "War 2",
                "The sixth entry in Yash Raj Films' Spy Universe, featuring Hrithik Roshan and Jr. NTR in an action-packed thriller.",
                "Action, Thriller, Spy", "UA", 150,
                LocalDate.of(2025, 8, 14),
                "https://image.tmdb.org/t/p/w500/1Lh9LER4xRQ3INFFi2dfbn2x1ne.jpg",
                cinema1
        );
        System.out.println("Movie 1 created: " + movie1.getTitle());

        Movie movie2 = createMovieIfNotExists(
                "De De Pyaar De 2",
                "Sequel to the romantic comedy featuring Ajay Devgn, R. Madhavan, and Rakul Preet Singh in another hilarious love triangle.",
                "Romance, Comedy, Drama", "UA", 140,
                LocalDate.of(2025, 7, 4),
                "https://image.tmdb.org/t/p/w500/2vFuG6bWGyQzJJzbshWZ3d5vUKH.jpg",
                cinema1
        );

        Movie movie3 = createMovieIfNotExists(
                "The Delhi Files",
                "A historical drama by Vivek Ranjan Agnihotri exploring significant moments in Indian history and the events leading to India's partition.",
                "Historical, Drama, Crime", "UA", 160,
                LocalDate.of(2025, 8, 15),
                "https://image.tmdb.org/t/p/w500/3gFuG6bWGyQzJJzbshWZ3d5vUKH.jpg",
                cinema2
        );

        Movie movie4 = createMovieIfNotExists(
                "Param Sundari",
                "A romantic drama starring Janhvi Kapoor and Sidharth Malhotra, exploring the complexities of love and relationships.",
                "Romance, Drama", "UA", 130,
                LocalDate.of(2025, 7, 25),
                "https://image.tmdb.org/t/p/w500/4hFuG6bWGyQzJJzbshWZ3d5vUKH.jpg",
                cinema2
        );

        // English Movies
        Movie movie5 = createMovieIfNotExists(
                "Fantastic Four",
                "Marvel's first family returns in this highly anticipated reboot featuring the iconic superhero team in a new adventure.",
                "Action, Adventure, Sci-Fi", "PG-13", 135,
                LocalDate.of(2025, 7, 25),
                "https://image.tmdb.org/t/p/w500/5iFuG6bWGyQzJJzbshWZ3d5vUKH.jpg",
                cinema3
        );

        Movie movie6 = createMovieIfNotExists(
                "Thunderbolts",
                "Marvel's anti-hero team assembles in this action-packed adventure featuring some of the most complex characters in the MCU.",
                "Action, Adventure, Sci-Fi", "PG-13", 145,
                LocalDate.of(2025, 8, 1),
                "https://image.tmdb.org/t/p/w500/6jFuG6bWGyQzJJzbshWZ3d5vUKH.jpg",
                cinema3
        );

        // ✅ Shows - Multiple shows for each movie across different cinemas
        // War 2 shows
        createShowIfNotExists(movie1, screen1, LocalDate.now().plusDays(1), LocalTime.of(10, 0), 350.0);
        createShowIfNotExists(movie1, screen1, LocalDate.now().plusDays(1), LocalTime.of(14, 30), 350.0);
        createShowIfNotExists(movie1, screen2, LocalDate.now().plusDays(1), LocalTime.of(19, 0), 350.0);
        createShowIfNotExists(movie1, screen1, LocalDate.now().plusDays(2), LocalTime.of(11, 0), 350.0);

        // De De Pyaar De 2 shows
        createShowIfNotExists(movie2, screen2, LocalDate.now().plusDays(1), LocalTime.of(11, 0), 250.0);
        createShowIfNotExists(movie2, screen1, LocalDate.now().plusDays(1), LocalTime.of(15, 30), 250.0);
        createShowIfNotExists(movie2, screen2, LocalDate.now().plusDays(1), LocalTime.of(20, 0), 250.0);
        createShowIfNotExists(movie2, screen1, LocalDate.now().plusDays(2), LocalTime.of(12, 0), 250.0);

        // The Delhi Files shows
        createShowIfNotExists(movie3, screen3, LocalDate.now().plusDays(1), LocalTime.of(12, 0), 300.0);
        createShowIfNotExists(movie3, screen3, LocalDate.now().plusDays(1), LocalTime.of(16, 0), 300.0);
        createShowIfNotExists(movie3, screen4, LocalDate.now().plusDays(1), LocalTime.of(20, 30), 300.0);
        createShowIfNotExists(movie3, screen3, LocalDate.now().plusDays(2), LocalTime.of(13, 0), 300.0);

        // Param Sundari shows
        createShowIfNotExists(movie4, screen4, LocalDate.now().plusDays(1), LocalTime.of(10, 30), 200.0);
        createShowIfNotExists(movie4, screen3, LocalDate.now().plusDays(1), LocalTime.of(14, 0), 200.0);
        createShowIfNotExists(movie4, screen4, LocalDate.now().plusDays(1), LocalTime.of(18, 30), 200.0);
        createShowIfNotExists(movie4, screen3, LocalDate.now().plusDays(2), LocalTime.of(11, 30), 200.0);

        // Fantastic Four shows
        createShowIfNotExists(movie5, screen5, LocalDate.now().plusDays(1), LocalTime.of(11, 30), 400.0);
        createShowIfNotExists(movie5, screen5, LocalDate.now().plusDays(1), LocalTime.of(15, 0), 400.0);
        createShowIfNotExists(movie5, screen6, LocalDate.now().plusDays(1), LocalTime.of(19, 30), 400.0);
        createShowIfNotExists(movie5, screen5, LocalDate.now().plusDays(2), LocalTime.of(12, 30), 400.0);

        // Thunderbolts shows
        createShowIfNotExists(movie6, screen6, LocalDate.now().plusDays(1), LocalTime.of(13, 0), 450.0);
        createShowIfNotExists(movie6, screen5, LocalDate.now().plusDays(1), LocalTime.of(17, 0), 450.0);
        createShowIfNotExists(movie6, screen6, LocalDate.now().plusDays(1), LocalTime.of(21, 0), 450.0);
        createShowIfNotExists(movie6, screen5, LocalDate.now().plusDays(2), LocalTime.of(14, 0), 450.0);

        // ✅ Seats
        createSeatsForScreen(screen1);
        createSeatsForScreen(screen2);
        createSeatsForScreen(screen3);
        createSeatsForScreen(screen4);
        createSeatsForScreen(screen5);
        createSeatsForScreen(screen6);
    }

    // ----------------- HELPERS -----------------

    private User createUserIfNotExists(String email, String name, String phone, boolean isAdmin) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setName(name);
            u.setPassword(PasswordUtil.hashPassword("password123")); // Default password for demo users
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
            try {
            Show s = new Show();
            s.setDate(date);
            s.setTime(time);
            s.setTicketPrice(price);
            s.setIsActive(true);
            s.setMovie(movie);
            s.setScreen(screen);
            return showRepository.save(s);
            } catch (Exception e) {
                // If there's a constraint violation, try to find the existing show
                System.out.println("Show already exists or constraint violation, attempting to find existing show...");
                return showRepository.findByMovieAndScreenAndDateAndTime(movie, screen, date, time)
                    .orElseThrow(() -> new RuntimeException("Failed to create or find show", e));
            }
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
