package com.frontdesk.repository;

import com.frontdesk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);
}
