package com.cinema.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
            "message", "Cinema Booking System API",
            "version", "1.0.0",
            "status", "running",
            "endpoints", Map.of(
                "cinemas", "/api/cinemas",
                "users", "/api/users",
                "movies", "/api/movies",
                "bookings", "/api/bookings",
                "seats", "/api/seats"
            )
        );
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
