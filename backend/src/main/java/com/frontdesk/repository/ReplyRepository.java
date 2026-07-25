package com.frontdesk.repository;

import com.frontdesk.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

import java.util.Optional;

public interface ReplyRepository extends JpaRepository<Reply, UUID> {

    Optional<Reply> findByInquiryId(UUID inquiryId);
}
