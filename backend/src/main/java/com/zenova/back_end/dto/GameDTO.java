package com.zenova.back_end.dto;

import com.zenova.back_end.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Pattern;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class GameDTO {
    private Long id;
    @Pattern(regexp = "^[a-zA-Z0-9 ]*$", message = "Name should be alphanumeric and spaces are allowed")
    private String name;

    @Pattern(regexp = "^[a-zA-Z0-9 ,.]*$", message = "Description should be alphanumeric and can include commas and periods")
    private String description;

    private Category category;

    @Pattern(regexp = "^[a-zA-Z0-9 ,.]*$", message = "Rules should be alphanumeric and can include commas and periods")
    private String rules;

    @Pattern(regexp = "^[0-9]*$", message = "Price should be numeric")
    private String price;

    @Pattern(regexp = "^[a-zA-Z0-9/._-]*$", message = "Image path should be a valid path")
    private String image;

    @Pattern(regexp = "^[a-zA-Z0-9/._-]*$", message = "File path should be a valid path")
    private String filepath;

    private boolean active;

    public GameDTO(Long gameId) {
        this.id = gameId;
    }
}
