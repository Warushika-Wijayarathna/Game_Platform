package com.zenova.back_end.repo;

import com.zenova.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User,UUID> {

    User findByEmail(String userName);

    boolean existsByEmail(String userName);

    User findByUid(UUID uid);
}
