package com.zenova.back_end.service.impl;

import com.zenova.back_end.dto.CategoryDTO;
import com.zenova.back_end.entity.Category;
import com.zenova.back_end.repo.CategoryRepository;
import com.zenova.back_end.service.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    ModelMapper modelMapper;



    @Override
    public Object addCategory(CategoryDTO categoryDTO) {
        Category category = modelMapper.map(categoryDTO, Category.class);
        category = categoryRepository.save(category);

        return modelMapper.map(category, CategoryDTO.class);
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .toList();
    }

    @Override
    public Object updateCategory(CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(String.valueOf(categoryDTO.getId()))
                .orElseThrow(() -> new RuntimeException("Category not found"));
        modelMapper.map(categoryDTO, category);
        category = categoryRepository.save(category);
        return modelMapper.map(category, CategoryDTO.class);
    }

    @Override
    public Object deactivateCategory(Long id) {
        Category category = categoryRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setActive(false);
        category = categoryRepository.save(category);
        return modelMapper.map(category, CategoryDTO.class);
    }

    @Override
    public List<CategoryDTO> getAllActiveCategories() {
        List<Category> categories = categoryRepository.findAllByActiveTrue();
        return categories.stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .toList();
    }
}
