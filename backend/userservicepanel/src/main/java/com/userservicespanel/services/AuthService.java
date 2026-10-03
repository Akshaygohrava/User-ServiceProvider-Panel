package com.userservicespanel.services;

import com.userservicespanel.dto.AuthResponse;
import com.userservicespanel.dto.LoginRequest;
import com.userservicespanel.dto.RegisterRequest;
import com.userservicespanel.entites.User;
import com.userservicespanel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email is already registered! Please login.")
                    .build();
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().trim().toLowerCase())
                .password(request.getPassword()) // In full prod, use BCryptPasswordEncoder
                .phone(request.getPhone())
                .role("USER")
                .address(request.getAddress())
                .city(request.getCity())
                .build();

        User savedUser = userRepository.save(user);
        String token = "usr_" + UUID.randomUUID().toString().replace("-", "");

        return AuthResponse.builder()
                .success(true)
                .message("User registered successfully!")
                .token(token)
                .user(savedUser)
                .build();
    }

    public AuthResponse registerProvider(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email is already registered! Please login.")
                    .build();
        }

        User provider = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().trim().toLowerCase())
                .password(request.getPassword())
                .phone(request.getPhone())
                .role("SERVICE_PROVIDER")
                .businessName(request.getBusinessName() != null && !request.getBusinessName().isEmpty() 
                        ? request.getBusinessName() 
                        : request.getFullName() + " Services")
                .specialization(request.getSpecialization() != null && !request.getSpecialization().isEmpty()
                        ? request.getSpecialization()
                        : "AC Repair & Maintenance")
                .address(request.getAddress())
                .city(request.getCity())
                .rating(4.9)
                .reviewCount(24)
                .build();

        User savedProvider = userRepository.save(provider);
        String token = "sp_" + UUID.randomUUID().toString().replace("-", "");

        return AuthResponse.builder()
                .success(true)
                .message("Service Provider account created successfully!")
                .token(token)
                .user(savedProvider)
                .build();
    }

    public AuthResponse loginUser(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Account not found with this email.")
                    .build();
        }

        if (!"USER".equalsIgnoreCase(user.getRole())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("This account is registered as a Service Provider. Please use Service Provider Login.")
                    .build();
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid password! Please try again.")
                    .build();
        }

        String token = "usr_" + UUID.randomUUID().toString().replace("-", "");
        return AuthResponse.builder()
                .success(true)
                .message("User logged in successfully!")
                .token(token)
                .user(user)
                .build();
    }

    public AuthResponse loginProvider(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User provider = userRepository.findByEmail(email).orElse(null);

        if (provider == null) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Service Provider account not found with this email.")
                    .build();
        }

        if (!"SERVICE_PROVIDER".equalsIgnoreCase(provider.getRole())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("This account is registered as a standard User. Please use User Login.")
                    .build();
        }

        if (!provider.getPassword().equals(request.getPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid password! Please try again.")
                    .build();
        }

        String token = "sp_" + UUID.randomUUID().toString().replace("-", "");
        return AuthResponse.builder()
                .success(true)
                .message("Service Provider logged in successfully!")
                .token(token)
                .user(provider)
                .build();
    }
}
