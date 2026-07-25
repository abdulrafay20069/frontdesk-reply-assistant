package com.frontdesk.controller;

import com.frontdesk.dto.ReplyResponse;
import com.frontdesk.dto.UpdateDraftRequest;
import com.frontdesk.entity.Reply;
import com.frontdesk.entity.User;
import com.frontdesk.service.ReplyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/replies")
public class ReplyController {

    private final ReplyService replyService;

    public ReplyController(ReplyService replyService) {
        this.replyService = replyService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReplyResponse> updateDraft(@PathVariable UUID id,
                                                     @Valid @RequestBody UpdateDraftRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Reply reply = replyService.updateDraft(id, request.getDraftText(), currentUser.getId());
        return ResponseEntity.ok(toReplyResponse(reply));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ReplyResponse> approveReply(@PathVariable UUID id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Reply reply = replyService.approveReply(id, currentUser.getId());
        return ResponseEntity.ok(toReplyResponse(reply));
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<ReplyResponse> sendReply(@PathVariable UUID id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Reply reply = replyService.sendReply(id, currentUser.getId());
        return ResponseEntity.ok(toReplyResponse(reply));
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
