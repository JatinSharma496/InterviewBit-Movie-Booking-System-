package com.cinema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CinemaDto {
    
    private Long id;
    
    @NotBlank(message = "Cinema name is required")
    @Size(min = 2, max = 100, message = "Cinema name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Location is required")
    @Size(min = 5, max = 200, message = "Location must be between 5 and 200 characters")
    private String location;
    
    private String contactInfo;
    
    private List<ScreenDto> screens;
}
