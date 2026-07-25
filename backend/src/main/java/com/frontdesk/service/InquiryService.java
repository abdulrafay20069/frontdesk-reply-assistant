package com.frontdesk.service;

import com.frontdesk.entity.Inquiry;
import com.frontdesk.entity.InquiryChannel;
import com.frontdesk.entity.InquiryStatus;
import com.frontdesk.exception.ResourceNotFoundException;
import com.frontdesk.repository.InquiryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    public InquiryService(InquiryRepository inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    @Transactional
    public Inquiry createInquiry(String customerName, String customerEmail,
                                 InquiryChannel channel, String messageText) {
        Inquiry inquiry = new Inquiry();
        inquiry.setCustomerName(customerName);
        inquiry.setCustomerEmail(customerEmail);
        inquiry.setChannel(channel);
        inquiry.setMessageText(messageText);
        inquiry.setStatus(InquiryStatus.NEW);
        return inquiryRepository.save(inquiry);
    }

    @Transactional(readOnly = true)
    public List<Inquiry> listInquiries(InquiryStatus status) {
        if (status != null) {
            return inquiryRepository.findByStatusOrderByReceivedAtDesc(status);
        }
        return inquiryRepository.findAllByOrderByReceivedAtDesc();
    }

    @Transactional(readOnly = true)
    public Inquiry getInquiry(UUID id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found: " + id));
    }

    @Transactional
    public Inquiry updateStatus(UUID id, InquiryStatus status) {
        Inquiry inquiry = getInquiry(id);
        inquiry.setStatus(status);
        return inquiryRepository.save(inquiry);
    }
}
