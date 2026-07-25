package com.frontdesk.repository;

import com.frontdesk.entity.BusinessProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BusinessProfileRepository extends JpaRepository<BusinessProfile, UUID> {
}
