package com.focus.focus.controller;

import com.focus.focus.dto.StatsDataPoint;
import com.focus.focus.dto.TopTagDto;
import com.focus.focus.dto.TopTaskDto;
import com.focus.focus.model.entity.Usuario;
import com.focus.focus.security.SecurityUser;
import com.focus.focus.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<StatsDataPoint>> weekly(@AuthenticationPrincipal SecurityUser user) {
        Usuario usuario = user.getUsuario();
        return ResponseEntity.ok(statsService.getWeeklyStats(usuario));
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<StatsDataPoint>> monthly(@AuthenticationPrincipal SecurityUser user) {
        Usuario usuario = user.getUsuario();
        return ResponseEntity.ok(statsService.getMonthlyStats(usuario));
    }

    @GetMapping("/top-tasks")
    public ResponseEntity<List<TopTaskDto>> topTasks(
            @AuthenticationPrincipal SecurityUser user,
            @RequestParam(defaultValue = "5") int limit
    ) {
        Usuario usuario = user.getUsuario();
        int safeLimit = Math.min(Math.max(limit, 1), 20);
        return ResponseEntity.ok(statsService.getTopTasks(usuario, safeLimit));
    }

    @GetMapping("/top-tags")
    public ResponseEntity<List<TopTagDto>> topTags(
            @AuthenticationPrincipal SecurityUser user,
            @RequestParam(defaultValue = "5") int limit
    ) {
        Usuario usuario = user.getUsuario();
        int safeLimit = Math.min(Math.max(limit, 1), 20);
        return ResponseEntity.ok(statsService.getTopTags(usuario, safeLimit));
    }
}
