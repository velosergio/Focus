package com.focus.focus.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/", ""})
    public ResponseEntity<Map<String, String>> root() {
        return ResponseEntity.ok(Map.of(
                "app", "Focus",
                "status", "running",
                "docs", "API REST: /auth/register, /auth/login, /health"
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
