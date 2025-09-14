package com.cinema.service;

import com.cinema.dto.LoginRequest;
import com.cinema.dto.SignupRequest;
import com.cinema.dto.UserDto;
import com.cinema.entity.User;
import com.cinema.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserDto createUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("User with email " + userDto.getEmail() + " already exists");
        }
        
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setName(userDto.getName());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setIsAdmin(userDto.getIsAdmin());
        
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }
    
    public UserDto signup(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("User with email " + signupRequest.getEmail() + " already exists");
        }
        
        System.out.println("=== SIGNUP DEBUG ===");
        System.out.println("Received isAdmin: " + signupRequest.getIsAdmin());
        System.out.println("isAdmin type: " + (signupRequest.getIsAdmin() != null ? signupRequest.getIsAdmin().getClass().getSimpleName() : "null"));
        
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setName(signupRequest.getName());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        
        // Explicitly set isAdmin - don't rely on default value
        Boolean adminValue = signupRequest.getIsAdmin();
        if (adminValue == null) {
            adminValue = false;
        }
        user.setIsAdmin(adminValue);
        
        System.out.println("User entity isAdmin before save: " + user.getIsAdmin());
        System.out.println("Admin value set: " + adminValue);
        
        User savedUser = userRepository.save(user);
        
        System.out.println("User entity isAdmin after save: " + savedUser.getIsAdmin());
        System.out.println("User ID: " + savedUser.getId());
        System.out.println("===================");
        
        return convertToDto(savedUser);
    }
    
    public UserDto login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        return convertToDto(user);
    }
    
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToDto(user);
    }
    
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return convertToDto(user);
    }
    
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setName(userDto.getName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setIsAdmin(userDto.getIsAdmin());
        
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }
    
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setIsAdmin(user.getIsAdmin());
        return dto;
    }
}
