package com.frontdesk.controller;

import com.frontdesk.dto.BusinessProfileRequest;
import com.frontdesk.dto.BusinessProfileResponse;
import com.frontdesk.entity.BusinessProfile;
import com.frontdesk.service.BusinessProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business-profile")
public class BusinessProfileController {

    private final BusinessProfileService businessProfileService;

    public BusinessProfileController(BusinessProfileService businessProfileService) {
        this.businessProfileService = businessProfileService;
    }

    @GetMapping
    public ResponseEntity<BusinessProfileResponse> getProfile() {
        BusinessProfile profile = businessProfileService.getProfile();
        return ResponseEntity.ok(toResponse(profile));
    }

    @PutMapping
    public ResponseEntity<BusinessProfileResponse> updateProfile(
            @Valid @RequestBody BusinessProfileRequest request) {
        BusinessProfile profile = businessProfileService.updateProfile(
                request.getBusinessName(),
                request.getDescription(),
                request.getTone(),
                request.getFaqContext());
        return ResponseEntity.ok(toResponse(profile));
    }

    private BusinessProfileResponse toResponse(BusinessProfile profile) {
        BusinessProfileResponse response = new BusinessProfileResponse();
        response.setId(profile.getId());
        response.setBusinessName(profile.getBusinessName());
        response.setDescription(profile.getDescription());
        response.setTone(profile.getTone());
        response.setFaqContext(profile.getFaqContext());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }
}
