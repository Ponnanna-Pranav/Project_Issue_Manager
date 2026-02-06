package com.bugtracker.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "issues")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Issue extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private IssueStatus status = IssueStatus.OPEN;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    @ManyToOne
    private User createdBy;

    @ManyToOne
    private User assignedTo;

    @ManyToOne
    private Project project;
}
