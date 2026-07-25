package com.frontdesk.repository;

import com.frontdesk.entity.Inquiry;
import com.frontdesk.entity.InquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InquiryRepository extends JpaRepository<Inquiry, UUID> {

    List<Inquiry> findByStatusOrderByReceivedAtDesc(InquiryStatus status);

    List<Inquiry> findAllByOrderByReceivedAtDesc();
}
