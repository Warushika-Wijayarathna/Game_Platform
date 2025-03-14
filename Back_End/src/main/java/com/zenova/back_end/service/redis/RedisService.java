package com.zenova.back_end.service.redis;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.time.Duration;

@Service
public class RedisService {
    private final StringRedisTemplate redisTemplate;

    public RedisService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void storeSecretKey(String email, String secretKey) {
        redisTemplate.opsForValue().set(email, secretKey, Duration.ofHours(24)); // Store for 24 hours
    }

    public String getSecretKey(String email) {
        return redisTemplate.opsForValue().get(email);
    }
}
