package com.frontdesk.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateDraftRequest {

    @NotBlank
    private String draftText;

    public UpdateDraftRequest() {
    }

    public String getDraftText() {
        return draftText;
    }

    public void setDraftText(String draftText) {
        this.draftText = draftText;
    }
}
