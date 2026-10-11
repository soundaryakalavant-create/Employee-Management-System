package com.employee.management.controller;

import com.employee.management.model.User;
import com.employee.management.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String fullName = request.getOrDefault("fullName", "").trim();
        String email = request.getOrDefault("email", "").trim().toLowerCase();
        String password = request.getOrDefault("password", "");

        if (fullName.isBlank() || email.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are required"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Account created successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.getOrDefault("email", "").trim().toLowerCase();
        String password = request.getOrDefault("password", "");

        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "name", user.getFullName(),
                        "email", user.getEmail()
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password")));
    }
}
