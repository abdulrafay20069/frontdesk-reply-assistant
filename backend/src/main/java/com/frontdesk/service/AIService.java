package com.frontdesk.service;

import com.frontdesk.entity.BusinessProfile;
import com.frontdesk.exception.AIGenerationException;

public interface AIService {

    String generateDraft(String inquiryText, BusinessProfile profile) throws AIGenerationException;
}
