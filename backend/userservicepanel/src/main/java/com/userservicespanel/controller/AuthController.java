package com.userservicespanel.controller;

import com.userservicespanel.dto.AuthResponse;
import com.userservicespanel.dto.LoginRequest;
import com.userservicespanel.dto.RegisterRequest;
import com.userservicespanel.entites.User;
import com.userservicespanel.repository.UserRepository;
import com.userservicespanel.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    // 1. User Register
    @PostMapping("/register/user")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody RegisterRequest request) {
        request.setRole("USER");
        AuthResponse response = authService.registerUser(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    // 2. Service Provider Register
    @PostMapping("/register/provider")
    public ResponseEntity<AuthResponse> registerProvider(@RequestBody RegisterRequest request) {
        request.setRole("SERVICE_PROVIDER");
        AuthResponse response = authService.registerProvider(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    // 3. User Login
    @PostMapping("/login/user")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest request) {
        AuthResponse response = authService.loginUser(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    // 4. Service Provider Login
    @PostMapping("/login/provider")
    public ResponseEntity<AuthResponse> loginProvider(@RequestBody LoginRequest request) {
        AuthResponse response = authService.loginProvider(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    // 5. Get User Profile
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
}
