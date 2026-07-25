package com.frontdesk.repository;

import com.frontdesk.entity.ActivityEventType;
import com.frontdesk.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {

    List<ActivityLog> findAllByOrderByTimestampDesc();

    List<ActivityLog> findByEventTypeOrderByTimestampDesc(ActivityEventType eventType);
}
