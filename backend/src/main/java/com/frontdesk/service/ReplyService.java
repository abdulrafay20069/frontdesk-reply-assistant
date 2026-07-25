package com.frontdesk.service;

import com.frontdesk.entity.*;
import com.frontdesk.exception.AIGenerationException;
import com.frontdesk.exception.DraftGenerationFailedException;
import com.frontdesk.exception.IllegalStateTransitionException;
import com.frontdesk.exception.ResourceNotFoundException;
import com.frontdesk.repository.InquiryRepository;
import com.frontdesk.repository.ReplyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final InquiryRepository inquiryRepository;
    private final BusinessProfileService businessProfileService;
    private final AIService aiService;
    private final ActivityLogService activityLogService;

    public ReplyService(ReplyRepository replyRepository,
                        InquiryRepository inquiryRepository,
                        BusinessProfileService businessProfileService,
                        AIService aiService,
                        ActivityLogService activityLogService) {
        this.replyRepository = replyRepository;
        this.inquiryRepository = inquiryRepository;
        this.businessProfileService = businessProfileService;
        this.aiService = aiService;
        this.activityLogService = activityLogService;
    }

    @Transactional
    public Reply generateDraft(UUID inquiryId, UUID actorUserId) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found: " + inquiryId));

        try {
            BusinessProfile profile = businessProfileService.getProfile();
            String draftText = aiService.generateDraft(inquiry.getMessageText(), profile);

            Reply reply = replyRepository.findByInquiryId(inquiryId)
                    .orElseGet(Reply::new);

            reply.setInquiry(inquiry);
            reply.setDraftText(draftText);
            reply.setGeneratedAt(OffsetDateTime.now());
            reply.setAiModelUsed("llama-3.3-70b-versatile");

            if (actorUserId != null) {
                User actor = new User();
                actor.setId(actorUserId);
                reply.setLastEditedBy(actor);
            }

            Reply savedReply = replyRepository.save(reply);

            inquiry.setStatus(InquiryStatus.DRAFTED);
            inquiryRepository.save(inquiry);

            activityLogService.log(ActivityEventType.DRAFT_GENERATED, "Inquiry", inquiryId,
                    actorUserId, "Draft generated for inquiry " + inquiryId);

            return savedReply;
        } catch (AIGenerationException e) {
            inquiry.setStatus(InquiryStatus.FAILED);
            inquiryRepository.save(inquiry);

            activityLogService.log(ActivityEventType.GENERATION_FAILED, "Inquiry", inquiryId,
                    actorUserId, "Generation failed for inquiry " + inquiryId + ": " + e.getMessage());

            throw new DraftGenerationFailedException("Failed to generate draft for inquiry " + inquiryId, e);
        }
    }

    @Transactional
    public Reply updateDraft(UUID replyId, String newText, UUID actorUserId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found: " + replyId));

        if (reply.getSentAt() != null) {
            throw new IllegalStateTransitionException("Cannot modify a reply that has already been sent");
        }

        reply.setDraftText(newText);

        if (actorUserId != null) {
            User actor = new User();
            actor.setId(actorUserId);
            reply.setLastEditedBy(actor);
        }

        Reply savedReply = replyRepository.save(reply);

        activityLogService.log(ActivityEventType.DRAFT_EDITED, "Reply", replyId,
                actorUserId, "Draft edited for reply " + replyId);

        return savedReply;
    }

    @Transactional
    public Reply approveReply(UUID replyId, UUID actorUserId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found: " + replyId));

        Inquiry inquiry = reply.getInquiry();

        if (inquiry.getStatus() != InquiryStatus.DRAFTED) {
            throw new IllegalStateTransitionException(
                    "Cannot approve reply: inquiry status must be DRAFTED, current: " + inquiry.getStatus());
        }

        inquiry.setStatus(InquiryStatus.APPROVED);
        inquiryRepository.save(inquiry);

        reply.setApprovedAt(OffsetDateTime.now());
        if (actorUserId != null) {
            User actor = new User();
            actor.setId(actorUserId);
            reply.setApprovedBy(actor);
        }

        Reply savedReply = replyRepository.save(reply);

        activityLogService.log(ActivityEventType.REPLY_APPROVED, "Reply", replyId,
                actorUserId, "Reply approved for reply " + replyId);

        return savedReply;
    }

    @Transactional
    public Reply sendReply(UUID replyId, UUID actorUserId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found: " + replyId));

        Inquiry inquiry = reply.getInquiry();

        if (inquiry.getStatus() != InquiryStatus.APPROVED) {
            throw new IllegalStateTransitionException(
                    "Cannot send reply: inquiry status must be APPROVED, current: " + inquiry.getStatus());
        }

        inquiry.setStatus(InquiryStatus.SENT);
        inquiryRepository.save(inquiry);

        reply.setSentAt(OffsetDateTime.now());

        Reply savedReply = replyRepository.save(reply);

        activityLogService.log(ActivityEventType.REPLY_SENT, "Reply", replyId,
                actorUserId, "Reply sent for reply " + replyId);

        return savedReply;
    }
}
