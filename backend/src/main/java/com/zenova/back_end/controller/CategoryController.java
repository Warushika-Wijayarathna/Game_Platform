package com.zenova.back_end.controller;

import com.zenova.back_end.dto.CategoryDTO;
import com.zenova.back_end.dto.GameDTO;
import com.zenova.back_end.dto.ResponseDTO;
import com.zenova.back_end.service.CategoryService;
import com.zenova.back_end.service.GameService;
import com.zenova.back_end.util.JwtUtil;
import com.zenova.back_end.util.VarList;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    private boolean isAdmin(String token) {
        Claims claims = jwtUtil.getUserRoleCodeFromToken(token);
        return "ADMIN".equals(claims.get("role", String.class));
    }

    @PostMapping(value = "/add")
    public ResponseEntity<ResponseDTO> addCategory(@RequestHeader("Authorization") String token, @RequestBody CategoryDTO categoryDTO) {
       if (!isAdmin(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ResponseDTO(VarList.Forbidden, "Access Denied", null));
            }
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ResponseDTO(VarList.Created, "Category Added",categoryService.addCategory(categoryDTO)));

    }

    @GetMapping("/all")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseDTO> updateCategory(@RequestHeader("Authorization") String token, @RequestBody CategoryDTO categoryDTO) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ResponseDTO(VarList.Forbidden, "Access Denied", null));
        }
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Category Updated", categoryService.updateCategory(categoryDTO)));
    }

    @PostMapping("deactivate/{id}")
    public ResponseEntity<ResponseDTO> deactivateCategory(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ResponseDTO(VarList.Forbidden, "Access Denied", null));
        }
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Category Deactivated", categoryService.deactivateCategory(id)));
    }

    @GetMapping("/all-active")
    public ResponseEntity<List<CategoryDTO>> getAllActiveCategories() {
        return ResponseEntity.ok(categoryService.getAllActiveCategories());
    }

}
