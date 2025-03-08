package com.example.career.talks.estimates_application.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.standard.TomcatRequestUpgradeStrategy;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

/**
 * Configuration class in the Spring application context
 * Enables WebSocket message handling, backed by a message broker
 * implements WebSocketMessageBrokerConfigurer to customize the configuration
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    /**
     * Configure Message Broker options
     * Set up the broker for broadcasting messages to clients
     * Enables a simple memory-based message broker to carry messages back to the clients on the destination provided
     *
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    /**
     * Register Simple Text Oriented Messaging protocol endpoint
     * The endpoint serves as the connection point for WebSocket clients
     * Allows all origins to connect to the endpoint
     * SockJS is a JS library that provides WebSocket-lik
     *
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
                .addEndpoint("/ws")
                .setHandshakeHandler(new DefaultHandshakeHandler(new TomcatRequestUpgradeStrategy()))
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

}
