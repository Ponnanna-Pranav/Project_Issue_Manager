package com.bugtracker.backend.controller;

import com.bugtracker.backend.dto.LoginRequest;
import com.bugtracker.backend.model.User;
import com.bugtracker.backend.security.JwtUtil;
import com.bugtracker.backend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService service;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder encoder;

    public AuthController(UserService service,
            JwtUtil jwtUtil,
            PasswordEncoder encoder) {
        this.service = service;
        this.jwtUtil = jwtUtil;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        User user = service.findByEmail(request.getEmail());

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return Map.of(
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", "Software Engineer" // Mock role for now if not in User model, or user.getRole() if
                                                    // exists
                ));
    }
}
