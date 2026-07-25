package com.frontdesk.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class ReplyResponse {

    private UUID id;
    private UUID inquiryId;
    private String draftText;
    private String aiModelUsed;
    private OffsetDateTime generatedAt;
    private UUID lastEditedByUserId;
    private OffsetDateTime approvedAt;
    private UUID approvedByUserId;
    private OffsetDateTime sentAt;

    public ReplyResponse() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getInquiryId() {
        return inquiryId;
    }

    public void setInquiryId(UUID inquiryId) {
        this.inquiryId = inquiryId;
    }

    public String getDraftText() {
        return draftText;
    }

    public void setDraftText(String draftText) {
        this.draftText = draftText;
    }

    public String getAiModelUsed() {
        return aiModelUsed;
    }

    public void setAiModelUsed(String aiModelUsed) {
        this.aiModelUsed = aiModelUsed;
    }

    public OffsetDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(OffsetDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public UUID getLastEditedByUserId() {
        return lastEditedByUserId;
    }

    public void setLastEditedByUserId(UUID lastEditedByUserId) {
        this.lastEditedByUserId = lastEditedByUserId;
    }

    public OffsetDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(OffsetDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public UUID getApprovedByUserId() {
        return approvedByUserId;
    }

    public void setApprovedByUserId(UUID approvedByUserId) {
        this.approvedByUserId = approvedByUserId;
    }

    public OffsetDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(OffsetDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
