package com.frontdesk.controller;

import com.frontdesk.dto.ActivityLogResponse;
import com.frontdesk.service.ActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activity-log")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityLogResponse>> getActivityLogs() {
        List<ActivityLogResponse> logs = activityLogService.getActivityLogs();
        return ResponseEntity.ok(logs);
    }
}
