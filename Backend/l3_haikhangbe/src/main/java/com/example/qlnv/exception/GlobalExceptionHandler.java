package com.example.qlnv.exception;
import com.example.qlnv.dto.ResponseDto;
import io.jsonwebtoken.JwtException;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ResponseDto> handleException(IllegalArgumentException ex) {
        return new ResponseEntity<>(new ResponseDto(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ResponseDto> handleException(JwtException ex) {
        return new ResponseEntity<>(new ResponseDto(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ResponseDto> handleDatabaseException(DataAccessException ex) {
        String rawMessage = ex.getMostSpecificCause().getMessage();
        String cleanMessage = "";
        if (rawMessage != null && rawMessage.contains("ERROR:")) {
            cleanMessage = rawMessage.split("\n")[0].replace("ERROR:", "").trim();
        } else if (rawMessage != null) {
            cleanMessage = rawMessage;
        }
        return new ResponseEntity<>(new ResponseDto(cleanMessage), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ResponseDto> handleMessageNotReadable(HttpMessageNotReadableException ex) {
        return new ResponseEntity<>(new ResponseDto("Dữ liệu đầu vào sai định dạng (Vui lòng kiểm tra lại UUID, Số, Ngày tháng, relationshipType...)"), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ResponseDto> handleAccessDeniedException(AuthorizationDeniedException ex) {
        return new ResponseEntity<>(
                new ResponseDto("Bạn không có quyền truy cập vào chức năng này!"),
                HttpStatus.FORBIDDEN
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseDto> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(new ResponseDto(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

}