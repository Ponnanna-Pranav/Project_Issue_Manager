package com.bugtracker.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public String health() {
        return "Bug Tracker API is running!";
    }
}
