package com.zenova.back_end.controller;

import com.zenova.back_end.dto.CategoryDTO;
import com.zenova.back_end.dto.GameDTO;
import com.zenova.back_end.dto.ResponseDTO;
import com.zenova.back_end.service.CategoryService;
import com.zenova.back_end.service.GameService;
import com.zenova.back_end.util.JwtUtil;
import com.zenova.back_end.util.VarList;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("api/v1/category")
public class CategoryController {
    @Autowired
    private final CategoryService categoryService;

    @Autowired
    private final JwtUtil jwtUtil;

    public CategoryController(CategoryService categoryService, JwtUtil jwtUtil) {
        this.categoryService = categoryService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping(value = "/all")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/all-active")
    public ResponseEntity<List<CategoryDTO>> getAllActiveCategories() {
        return ResponseEntity.ok(categoryService.getAllActiveCategories());
    }

    @PostMapping(value = "/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> addCategory(HttpServletRequest request, @RequestBody CategoryDTO categoryDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseDTO(VarList.Created, "Category Added", categoryService.addCategory(categoryDTO)));
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseDTO> updateCategory(HttpServletRequest request, @RequestBody CategoryDTO categoryDTO) {
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Category Updated", categoryService.updateCategory(categoryDTO)));
    }

    @PostMapping("deactivate/{id}")
    public ResponseEntity<ResponseDTO> deactivateCategory(HttpServletRequest request, @PathVariable Long id) {
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Category Deactivated", categoryService.deactivateCategory(id)));
    }

}
