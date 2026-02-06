package com.bugtracker.backend.service;

import com.bugtracker.backend.model.Project;
import com.bugtracker.backend.model.User;
import com.bugtracker.backend.repository.ProjectRepository;
import com.bugtracker.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public Project create(Project project, User creator) {
        project.setCreatedBy(creator);
        project.setMembers(List.of(creator));
        return projectRepository.save(project);
    }

    public Project addMember(Long projectId, Long userId, User requester) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getCreatedBy().getId().equals(requester.getId())) {
            throw new RuntimeException("Only owner can add members");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        project.getMembers().add(user);
        return projectRepository.save(project);
    }

    public List<Project> getMyProjects(User user) {
        List<Project> owned = projectRepository.findByCreatedBy(user);
        List<Project> member = projectRepository.findByMembersContaining(user);

        Set<Project> unique = new HashSet<>();
        unique.addAll(owned);
        unique.addAll(member);

        return new ArrayList<>(unique);
    }
}
