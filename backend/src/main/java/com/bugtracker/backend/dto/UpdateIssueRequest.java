package com.bugtracker.backend.dto;

import com.bugtracker.backend.model.IssueStatus;
import com.bugtracker.backend.model.Priority;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateIssueRequest {
    private IssueStatus status;
    private Priority priority;
}
