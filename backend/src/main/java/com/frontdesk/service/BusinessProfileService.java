package com.frontdesk.service;

import com.frontdesk.entity.BusinessProfile;
import com.frontdesk.entity.BusinessProfileTone;
import com.frontdesk.exception.ResourceNotFoundException;
import com.frontdesk.repository.BusinessProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BusinessProfileService {

    private final BusinessProfileRepository businessProfileRepository;

    public BusinessProfileService(BusinessProfileRepository businessProfileRepository) {
        this.businessProfileRepository = businessProfileRepository;
    }

    @Transactional(readOnly = true)
    public BusinessProfile getProfile() {
        return businessProfileRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Business profile not found"));
    }

    @Transactional
    public BusinessProfile updateProfile(String businessName, String description,
                                         BusinessProfileTone tone, String faqContext) {
        BusinessProfile profile = getProfile();
        profile.setBusinessName(businessName);
        profile.setDescription(description);
        profile.setTone(tone);
        profile.setFaqContext(faqContext);
        return businessProfileRepository.save(profile);
    }
}
