package com.frontdesk.dto;

import com.frontdesk.entity.InquiryChannel;
import com.frontdesk.entity.InquiryStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public class InquirySummaryResponse {

    private UUID id;
    private String customerName;
    private String customerEmail;
    private InquiryChannel channel;
    private String messageText;
    private OffsetDateTime receivedAt;
    private InquiryStatus status;

    public InquirySummaryResponse() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public InquiryChannel getChannel() {
        return channel;
    }

    public void setChannel(InquiryChannel channel) {
        this.channel = channel;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public OffsetDateTime getReceivedAt() {
        return receivedAt;
    }

    public void setReceivedAt(OffsetDateTime receivedAt) {
        this.receivedAt = receivedAt;
    }

    public InquiryStatus getStatus() {
        return status;
    }

    public void setStatus(InquiryStatus status) {
        this.status = status;
    }
}
