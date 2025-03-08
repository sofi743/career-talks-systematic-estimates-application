package com.example.career.talks.estimates_application.repositories;

import com.example.career.talks.estimates_application.beans.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findUserByCallsign(String callsign);
}
