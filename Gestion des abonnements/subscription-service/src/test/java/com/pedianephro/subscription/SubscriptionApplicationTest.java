package com.pedianephro.subscription;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class SubscriptionApplicationTest {

    @Test
    void shouldHaveExpectedSpringAnnotations() {
        assertNotNull(SubscriptionApplication.class.getAnnotation(SpringBootApplication.class));
        assertNotNull(SubscriptionApplication.class.getAnnotation(EnableDiscoveryClient.class));
        assertNotNull(SubscriptionApplication.class.getAnnotation(EnableScheduling.class));
    }
}
