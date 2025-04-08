package com.zenova.back_end.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/deploy")
@RequiredArgsConstructor
public class DeployController {

    @Value("${vercel.api.token}")
    private String vercelToken;

    @Value("${vercel.project.name}")
    private String vercelProjectName;

    @Value("${github.api.token}")
    private String githubToken;  // Add your GitHub token here

    @PostMapping("/vercel")
    public ResponseEntity<?> deployToVercel(@RequestBody Map<String, String> requestBody) {
        String repoUrl = requestBody.get("repoUrl");

        try {
            URI uri = new URI(repoUrl);
            String[] segments = uri.getPath().split("/");
            String owner = segments[1];
            String repoName = segments[2].replace(".git", "");

            // Fetch repoId from GitHub API
            String githubApiUrl = "https://api.github.com/repos/" + owner + "/" + repoName;
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + githubToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(githubApiUrl, HttpMethod.GET, entity, Map.class);
            Map<String, Object> githubRepo = response.getBody();

            String repoId = githubRepo != null ? String.valueOf(githubRepo.get("id")) : null;
            if (repoId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch repoId from GitHub.");
            }

            // Construct the payload with repoId
            Map<String, Object> repo = new HashMap<>();
            repo.put("name", repoName);
            repo.put("owner", owner);
            repo.put("id", repoId);  // Ensure repoId is included

            Map<String, Object> gitSource = new HashMap<>();
            gitSource.put("type", "github");
            gitSource.put("repo", repo);
            gitSource.put("ref", "master");  // Adjust to the correct branch if needed

            // Ensure repoId is correctly included here:
            System.out.println("Git Source: " + gitSource);

            Map<String, Object> body = new HashMap<>();
            body.put("gitSource", gitSource);
            body.put("name", vercelProjectName); // Use the project name from configuration

            HttpHeaders vercelHeaders = new HttpHeaders();
            vercelHeaders.setContentType(MediaType.APPLICATION_JSON);
            vercelHeaders.setBearerAuth(vercelToken);

            HttpEntity<Map<String, Object>> vercelEntity = new HttpEntity<>(body, vercelHeaders);

            String url = "https://api.vercel.com/v13/deployments";

            ResponseEntity<String> vercelResponse = restTemplate.postForEntity(url, vercelEntity, String.class);

            return ResponseEntity.ok(vercelResponse.getBody());
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("GitHub API error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to deploy: " + e.getMessage());
        }
    }
}
