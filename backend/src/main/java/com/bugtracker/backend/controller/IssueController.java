package com.bugtracker.backend.controller;

import com.bugtracker.backend.dto.UpdateIssueRequest;
import com.bugtracker.backend.model.Issue;
import com.bugtracker.backend.model.User;
import com.bugtracker.backend.service.IssueService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    // Create issue
    @PostMapping("/projects/{projectId}/issues")
    public Issue createIssue(@PathVariable Long projectId,
                             @RequestBody Issue issue,
                             @AuthenticationPrincipal User user) {
        return issueService.create(projectId, issue, user);
    }

    // Get issues of project
    @GetMapping("/projects/{projectId}/issues")
    public List<Issue> getIssues(@PathVariable Long projectId) {
        return issueService.getByProject(projectId);
    }

    // Assign issue
    @PutMapping("/issues/{issueId}/assign/{userId}")
    public Issue assign(@PathVariable Long issueId,
                        @PathVariable Long userId) {
        return issueService.assign(issueId, userId);
    }

    // Update issue (status + priority)
    @PutMapping("/issues/{issueId}")
    public Issue update(@PathVariable Long issueId,
                        @RequestBody UpdateIssueRequest req) {
        return issueService.update(issueId, req);
    }
}
