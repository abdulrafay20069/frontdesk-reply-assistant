package com.frontdesk.dto;

import com.frontdesk.entity.BusinessProfileTone;

import java.time.OffsetDateTime;
import java.util.UUID;

public class BusinessProfileResponse {

    private UUID id;
    private String businessName;
    private String description;
    private BusinessProfileTone tone;
    private String faqContext;
    private OffsetDateTime updatedAt;

    public BusinessProfileResponse() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BusinessProfileTone getTone() {
        return tone;
    }

    public void setTone(BusinessProfileTone tone) {
        this.tone = tone;
    }

    public String getFaqContext() {
        return faqContext;
    }

    public void setFaqContext(String faqContext) {
        this.faqContext = faqContext;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
