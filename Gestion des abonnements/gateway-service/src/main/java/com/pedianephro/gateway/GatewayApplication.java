package com.pedianephro.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {
	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}

	/**
	 * Configuration Dynamique des routes avec Load Balancing (Principe du Workshop 3)
	 * Utilise "lb://SERVICE-ID" pour déléguer la résolution d'adresse à Eureka.
	 */
	@Bean
	public RouteLocator dynamicRoutes(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("subscription-service-route", r -> r.path("/api/subscriptions/**")
						.uri("lb://subscription-service")) // Utilise le Load Balancer et Eureka
				.build();
	}
}
