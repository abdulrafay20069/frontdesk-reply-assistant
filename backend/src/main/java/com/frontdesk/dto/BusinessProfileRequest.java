package com.frontdesk.dto;

import com.frontdesk.entity.BusinessProfileTone;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BusinessProfileRequest {

    @NotBlank
    private String businessName;

    private String description;

    @NotNull
    private BusinessProfileTone tone;

    private String faqContext;

    public BusinessProfileRequest() {
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
}
