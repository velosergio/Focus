package com.focus.focus.service;

import com.focus.focus.dto.StatsDataPoint;
import com.focus.focus.dto.TopTagDto;
import com.focus.focus.dto.TopTaskDto;
import com.focus.focus.model.entity.Usuario;

import java.util.List;

public interface StatsService {

    List<StatsDataPoint> getWeeklyStats(Usuario usuario);

    List<StatsDataPoint> getMonthlyStats(Usuario usuario);

    List<TopTaskDto> getTopTasks(Usuario usuario, int limit);

    List<TopTagDto> getTopTags(Usuario usuario, int limit);
}
