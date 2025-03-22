package com.zenova.back_end.repo;

import com.zenova.back_end.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, String> {
    List<Category> findAllByActiveTrue();
}
