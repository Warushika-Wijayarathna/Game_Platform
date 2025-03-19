package com.zenova.back_end.service;

import com.zenova.back_end.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {
    Object addCategory(CategoryDTO categoryDTO);

    List<CategoryDTO> getAllCategories();

    Object updateCategory(CategoryDTO categoryDTO);

    Object deactivateCategory(Long id);

    List<CategoryDTO> getAllActiveCategories();
}
