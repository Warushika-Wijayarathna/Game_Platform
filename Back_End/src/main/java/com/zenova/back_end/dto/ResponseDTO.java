package com.zenova.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Component
public class ResponseDTO {
    private int code;
    private String message;
    private Object data;
}
