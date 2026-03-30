package com.bulkplaintshirt.auth.security.encryption;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@ControllerAdvice
public class EncryptResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    private final EncryptionUtil encryptionUtil;
    private final ObjectMapper objectMapper;

    public EncryptResponseBodyAdvice(EncryptionUtil encryptionUtil, ObjectMapper objectMapper) {
        this.encryptionUtil = encryptionUtil;
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        if (body == null || body instanceof String) {
            return body;
        }

        try {
            String bodyJson = objectMapper.writeValueAsString(body);
            // Encrypt the JSON response body
            response.getHeaders().setContentType(MediaType.TEXT_PLAIN);
            return encryptionUtil.encrypt(bodyJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error while encrypting response body: " + e.getMessage());
        }
    }
}
