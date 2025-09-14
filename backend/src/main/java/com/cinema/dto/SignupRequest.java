package com.cinema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @JsonProperty("email")
    private String email;
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @JsonProperty("name")
    private String name;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @JsonProperty("password")
    private String password;
    
    @JsonProperty("phoneNumber")
    private String phoneNumber;
    
    @JsonProperty("isAdmin")
    private Boolean isAdmin = false;
}
