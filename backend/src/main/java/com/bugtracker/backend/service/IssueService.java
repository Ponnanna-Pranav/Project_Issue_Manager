package com.bugtracker.backend.service;

import com.bugtracker.backend.dto.UpdateIssueRequest;
import com.bugtracker.backend.model.*;
import com.bugtracker.backend.repository.IssueRepository;
import com.bugtracker.backend.repository.ProjectRepository;
import com.bugtracker.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueService {

    private final IssueRepository issueRepo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;

    public IssueService(IssueRepository issueRepo,
                        ProjectRepository projectRepo,
                        UserRepository userRepo) {
        this.issueRepo = issueRepo;
        this.projectRepo = projectRepo;
        this.userRepo = userRepo;
    }

    // Create issue
    public Issue create(Long projectId, Issue issue, User creator) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        issue.setProject(project);
        issue.setCreatedBy(creator);
        issue.setStatus(IssueStatus.OPEN); // default
        return issueRepo.save(issue);
    }

    // Get all issues of project
    public List<Issue> getByProject(Long projectId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return issueRepo.findByProject(project);
    }

    // Assign issue
    public Issue assign(Long issueId, Long userId) {
        Issue issue = issueRepo.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        issue.setAssignedTo(user);
        return issueRepo.save(issue);
    }

    // Update issue (status + priority)
    public Issue update(Long issueId, UpdateIssueRequest req) {
        Issue issue = issueRepo.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        if (req.getStatus() != null)
            issue.setStatus(req.getStatus());

        if (req.getPriority() != null)
            issue.setPriority(req.getPriority());

        return issueRepo.save(issue);
    }
}
