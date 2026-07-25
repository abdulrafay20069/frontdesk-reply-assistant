package com.frontdesk.service;

import com.frontdesk.entity.*;
import com.frontdesk.exception.AIGenerationException;
import com.frontdesk.exception.DraftGenerationFailedException;
import com.frontdesk.exception.IllegalStateTransitionException;
import com.frontdesk.repository.InquiryRepository;
import com.frontdesk.repository.ReplyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReplyServiceTest {

    @Mock
    private ReplyRepository replyRepository;

    @Mock
    private InquiryRepository inquiryRepository;

    @Mock
    private BusinessProfileService businessProfileService;

    @Mock
    private AIService aiService;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private ReplyService replyService;

    @Captor
    private ArgumentCaptor<Reply> replyCaptor;

    @Captor
    private ArgumentCaptor<Inquiry> inquiryCaptor;

    private UUID inquiryId;
    private UUID replyId;
    private UUID actorUserId;
    private Inquiry inquiry;
    private Reply reply;
    private BusinessProfile profile;

    @BeforeEach
    void setUp() {
        inquiryId = UUID.randomUUID();
        replyId = UUID.randomUUID();
        actorUserId = UUID.randomUUID();

        inquiry = new Inquiry();
        inquiry.setId(inquiryId);
        inquiry.setCustomerName("Test Customer");
        inquiry.setCustomerEmail("test@example.com");
        inquiry.setChannel(InquiryChannel.WEB_FORM);
        inquiry.setMessageText("Test message");
        inquiry.setStatus(InquiryStatus.NEW);

        reply = new Reply();
        reply.setId(replyId);
        reply.setInquiry(inquiry);
        reply.setDraftText("Draft text");

        profile = new BusinessProfile();
        profile.setBusinessName("Test Co.");
        profile.setTone(BusinessProfileTone.WARM_FRIENDLY);
    }

    @Test
    void sendReply_shouldThrow_whenInquiryNotApproved() {
        inquiry.setStatus(InquiryStatus.DRAFTED);
        when(replyRepository.findById(replyId)).thenReturn(Optional.of(reply));

        assertThrows(IllegalStateTransitionException.class,
                () -> replyService.sendReply(replyId, actorUserId));
    }

    @Test
    void updateDraft_shouldThrow_whenReplyAlreadySent() {
        reply.setSentAt(java.time.OffsetDateTime.now());
        when(replyRepository.findById(replyId)).thenReturn(Optional.of(reply));

        assertThrows(IllegalStateTransitionException.class,
                () -> replyService.updateDraft(replyId, "new text", actorUserId));
    }

    @Test
    void generateDraft_onSuccess_shouldLogDraftGeneratedOnce() throws Exception {
        when(inquiryRepository.findById(inquiryId)).thenReturn(Optional.of(inquiry));
        when(businessProfileService.getProfile()).thenReturn(profile);
        when(aiService.generateDraft(anyString(), any())).thenReturn("Generated draft");
        when(replyRepository.findByInquiryId(inquiryId)).thenReturn(Optional.empty());
        when(replyRepository.save(any(Reply.class))).thenAnswer(i -> i.getArgument(0));
        when(inquiryRepository.save(any(Inquiry.class))).thenAnswer(i -> i.getArgument(0));

        replyService.generateDraft(inquiryId, actorUserId);

        verify(activityLogService, times(1)).log(
                eq(ActivityEventType.DRAFT_GENERATED), anyString(), eq(inquiryId),
                eq(actorUserId), anyString());
    }

    @Test
    void generateDraft_onFailure_shouldLogGenerationFailedOnce() throws Exception {
        when(inquiryRepository.findById(inquiryId)).thenReturn(Optional.of(inquiry));
        when(businessProfileService.getProfile()).thenReturn(profile);
        when(aiService.generateDraft(anyString(), any()))
                .thenThrow(new AIGenerationException("API error"));
        when(inquiryRepository.save(any(Inquiry.class))).thenAnswer(i -> i.getArgument(0));

        assertThrows(DraftGenerationFailedException.class,
                () -> replyService.generateDraft(inquiryId, actorUserId));

        verify(activityLogService, times(1)).log(
                eq(ActivityEventType.GENERATION_FAILED), anyString(), eq(inquiryId),
                eq(actorUserId), anyString());
    }

    @Test
    void generateDraft_onFailure_shouldSetStatusToFailed() throws Exception {
        when(inquiryRepository.findById(inquiryId)).thenReturn(Optional.of(inquiry));
        when(businessProfileService.getProfile()).thenReturn(profile);
        when(aiService.generateDraft(anyString(), any()))
                .thenThrow(new AIGenerationException("API error"));
        when(inquiryRepository.save(inquiryCaptor.capture())).thenAnswer(i -> i.getArgument(0));

        assertThrows(DraftGenerationFailedException.class,
                () -> replyService.generateDraft(inquiryId, actorUserId));

        assertEquals(InquiryStatus.FAILED, inquiryCaptor.getValue().getStatus());
    }

    @Test
    void generateDraft_onSuccess_shouldSetStatusToDrafted() throws Exception {
        when(inquiryRepository.findById(inquiryId)).thenReturn(Optional.of(inquiry));
        when(businessProfileService.getProfile()).thenReturn(profile);
        when(aiService.generateDraft(anyString(), any())).thenReturn("Generated draft");
        when(replyRepository.findByInquiryId(inquiryId)).thenReturn(Optional.empty());
        when(replyRepository.save(any(Reply.class))).thenAnswer(i -> i.getArgument(0));
        when(inquiryRepository.save(inquiryCaptor.capture())).thenAnswer(i -> i.getArgument(0));

        replyService.generateDraft(inquiryId, actorUserId);

        assertEquals(InquiryStatus.DRAFTED, inquiryCaptor.getValue().getStatus());
    }

    @Test
    void updateDraft_shouldLogDraftEditedOnce() {
        when(replyRepository.findById(replyId)).thenReturn(Optional.of(reply));
        when(replyRepository.save(any(Reply.class))).thenAnswer(i -> i.getArgument(0));

        replyService.updateDraft(replyId, "updated text", actorUserId);

        verify(activityLogService, times(1)).log(
                eq(ActivityEventType.DRAFT_EDITED), anyString(), eq(replyId),
                eq(actorUserId), anyString());
    }

    @Test
    void approveReply_shouldLogReplyApprovedOnce() {
        inquiry.setStatus(InquiryStatus.DRAFTED);
        when(replyRepository.findById(replyId)).thenReturn(Optional.of(reply));
        when(inquiryRepository.save(any(Inquiry.class))).thenAnswer(i -> i.getArgument(0));
        when(replyRepository.save(any(Reply.class))).thenAnswer(i -> i.getArgument(0));

        replyService.approveReply(replyId, actorUserId);

        verify(activityLogService, times(1)).log(
                eq(ActivityEventType.REPLY_APPROVED), anyString(), eq(replyId),
                eq(actorUserId), anyString());
    }

    @Test
    void sendReply_shouldLogReplySentOnce() {
        inquiry.setStatus(InquiryStatus.APPROVED);
        when(replyRepository.findById(replyId)).thenReturn(Optional.of(reply));
        when(inquiryRepository.save(any(Inquiry.class))).thenAnswer(i -> i.getArgument(0));
        when(replyRepository.save(any(Reply.class))).thenAnswer(i -> i.getArgument(0));

        replyService.sendReply(replyId, actorUserId);

        verify(activityLogService, times(1)).log(
                eq(ActivityEventType.REPLY_SENT), anyString(), eq(replyId),
                eq(actorUserId), anyString());
    }
}
