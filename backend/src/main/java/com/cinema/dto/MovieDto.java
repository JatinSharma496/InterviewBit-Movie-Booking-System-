package com.cinema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieDto {
    
    private Long id;
    
    @NotBlank(message = "Movie title is required")
    @Size(min = 2, max = 200, message = "Title must be between 2 and 200 characters")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Genre is required")
    private String genre;
    
    @NotBlank(message = "Rating is required")
    private String rating;
    
    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer duration;
    
    private LocalDate releaseDate;
    private String posterUrl;
    private Boolean isActive = true;
    
    private Long cinemaId;
    private List<ShowDto> shows;
}
