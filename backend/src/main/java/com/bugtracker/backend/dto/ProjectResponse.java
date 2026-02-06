package com.bugtracker.backend.dto;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        String createdByName
) {}
