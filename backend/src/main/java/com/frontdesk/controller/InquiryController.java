package com.frontdesk.controller;

import com.frontdesk.dto.*;
import com.frontdesk.entity.Inquiry;
import com.frontdesk.entity.InquiryStatus;
import com.frontdesk.entity.Reply;
import com.frontdesk.entity.User;
import com.frontdesk.repository.ReplyRepository;
import com.frontdesk.service.InquiryService;
import com.frontdesk.service.ReplyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;
    private final ReplyService replyService;
    private final ReplyRepository replyRepository;

    public InquiryController(InquiryService inquiryService, ReplyService replyService,
                             ReplyRepository replyRepository) {
        this.inquiryService = inquiryService;
        this.replyService = replyService;
        this.replyRepository = replyRepository;
    }

    @GetMapping
    public ResponseEntity<List<InquirySummaryResponse>> listInquiries(
            @RequestParam(required = false) InquiryStatus status) {
        List<Inquiry> inquiries = inquiryService.listInquiries(status);
        List<InquirySummaryResponse> responses = inquiries.stream()
                .map(this::toSummaryResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<InquirySummaryResponse> createInquiry(
            @Valid @RequestBody InquiryRequest request) {
        Inquiry inquiry = inquiryService.createInquiry(
                request.getCustomerName(),
                request.getCustomerEmail(),
                request.getChannel(),
                request.getMessageText());
        return ResponseEntity.status(HttpStatus.CREATED).body(toSummaryResponse(inquiry));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InquiryDetailResponse> getInquiry(@PathVariable UUID id) {
        Inquiry inquiry = inquiryService.getInquiry(id);
        InquiryDetailResponse response = toDetailResponse(inquiry);

        replyRepository.findByInquiryId(id).ifPresent(reply -> {
            response.setReply(toReplyResponse(reply));
        });

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/draft")
    public ResponseEntity<ReplyResponse> generateDraft(@PathVariable UUID id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Reply reply = replyService.generateDraft(id, currentUser.getId());
        return ResponseEntity.ok(toReplyResponse(reply));
    }

    private InquirySummaryResponse toSummaryResponse(Inquiry inquiry) {
        InquirySummaryResponse response = new InquirySummaryResponse();
        response.setId(inquiry.getId());
        response.setCustomerName(inquiry.getCustomerName());
        response.setCustomerEmail(inquiry.getCustomerEmail());
        response.setChannel(inquiry.getChannel());
        String preview = inquiry.getMessageText();
        if (preview != null && preview.length() > 120) {
            preview = preview.substring(0, 120);
        }
        response.setMessageText(preview);
        response.setReceivedAt(inquiry.getReceivedAt());
        response.setStatus(inquiry.getStatus());
        return response;
    }

    private InquiryDetailResponse toDetailResponse(Inquiry inquiry) {
        InquiryDetailResponse response = new InquiryDetailResponse();
        response.setId(inquiry.getId());
        response.setCustomerName(inquiry.getCustomerName());
        response.setCustomerEmail(inquiry.getCustomerEmail());
        response.setChannel(inquiry.getChannel());
        response.setMessageText(inquiry.getMessageText());
        response.setReceivedAt(inquiry.getReceivedAt());
        response.setStatus(inquiry.getStatus());
        return response;
    }

    private ReplyResponse toReplyResponse(Reply reply) {
        ReplyResponse response = new ReplyResponse();
        response.setId(reply.getId());
        response.setInquiryId(reply.getInquiry().getId());
        response.setDraftText(reply.getDraftText());
        response.setAiModelUsed(reply.getAiModelUsed());
        response.setGeneratedAt(reply.getGeneratedAt());
        if (reply.getLastEditedBy() != null) {
            response.setLastEditedByUserId(reply.getLastEditedBy().getId());
        }
        response.setApprovedAt(reply.getApprovedAt());
        if (reply.getApprovedBy() != null) {
            response.setApprovedByUserId(reply.getApprovedBy().getId());
        }
        response.setSentAt(reply.getSentAt());
        return response;
    }
}
