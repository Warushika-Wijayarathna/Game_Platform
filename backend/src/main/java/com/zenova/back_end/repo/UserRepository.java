package com.zenova.back_end.repo;

import com.zenova.back_end.entity.User;
import com.zenova.back_end.util.Role;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User,UUID> {

    User findByEmail(String userName);

    boolean existsByEmail(String userName);

    User findByUid(UUID uid);

    User getReferenceByEmail(@Email(message = "Email should be valid") String email);

    @Query(value = "SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Object countByRole(Role role);
}
