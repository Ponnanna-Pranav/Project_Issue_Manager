package com.bugtracker.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;

@Entity
public class TestEntity {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
}
