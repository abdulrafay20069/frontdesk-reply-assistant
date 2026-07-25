package com.frontdesk.service;

import com.frontdesk.dto.ActivityLogResponse;
import com.frontdesk.entity.ActivityEventType;
import com.frontdesk.entity.ActivityLog;
import com.frontdesk.entity.User;
import com.frontdesk.repository.ActivityLogRepository;
import com.frontdesk.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository, UserRepository userRepository) {
        this.activityLogRepository = activityLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void log(ActivityEventType eventType, String relatedEntityType,
                    UUID relatedEntityId, UUID actorUserId, String detailText) {
        ActivityLog log = new ActivityLog();
        log.setEventType(eventType);
        log.setRelatedEntityType(relatedEntityType);
        log.setRelatedEntityId(relatedEntityId);

        if (actorUserId != null) {
            User actor = userRepository.findById(actorUserId)
                    .orElse(null);
            log.setActor(actor);
        }

        log.setDetailText(detailText);
        activityLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<ActivityLogResponse> getActivityLogs() {
        return activityLogRepository.findAllByOrderByTimestampDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ActivityLogResponse toResponse(ActivityLog log) {
        ActivityLogResponse response = new ActivityLogResponse();
        response.setId(log.getId());
        response.setEventType(log.getEventType());
        response.setRelatedEntityType(log.getRelatedEntityType());
        response.setRelatedEntityId(log.getRelatedEntityId());
        if (log.getActor() != null) {
            response.setActorUserId(log.getActor().getId());
            response.setActorFullName(log.getActor().getFullName());
        }
        response.setTimestamp(log.getTimestamp());
        response.setDetailText(log.getDetailText());
        return response;
    }
}
