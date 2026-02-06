package com.bugtracker.backend.controller;

import com.bugtracker.backend.model.Project;
import com.bugtracker.backend.model.User;
import com.bugtracker.backend.service.ProjectService;
import com.bugtracker.backend.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;

    public ProjectController(ProjectService projectService,
                             UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    // CREATE PROJECT
    @PostMapping
    public Project createProject(@RequestBody Project project,
                                 @AuthenticationPrincipal String email) {

        User user = userService.findByEmail(email)
;
        return projectService.create(project, user);
    }

    // GET MY PROJECTS
    @GetMapping("/my")
    public List<Project> myProjects(@AuthenticationPrincipal String email) {
        User user = userService.findByEmail(email)
;
        return projectService.getMyProjects(user);
    }

    // ADD MEMBER
    @PostMapping("/{projectId}/members/{userId}")
    public Project addMember(@PathVariable Long projectId,
                             @PathVariable Long userId,
                             @AuthenticationPrincipal String email) {

        User requester = userService.findByEmail(email)
;
        return projectService.addMember(projectId, userId, requester);
    }
}
