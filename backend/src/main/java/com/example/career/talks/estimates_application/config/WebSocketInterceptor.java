package com.example.career.talks.estimates_application.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.ChannelInterceptor;

public class WebSocketInterceptor implements ChannelInterceptor {
    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketInterceptor.class);

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        LOGGER.info("Sending message: {}", message);
        return message;
    }

    @Override
    public void postSend(Message<?> message, MessageChannel channel, boolean sent) {
        LOGGER.info("Message sent: {}", message);
    }

    @Override
    public void afterSendCompletion(Message<?> message, MessageChannel channel, boolean sent, Exception ex) {
        LOGGER.info("After message sent: {}", message);
    }

    @Override
    public boolean preReceive(MessageChannel channel) {
        LOGGER.info("Receiving message from channel: {}", channel);
        return true;
    }

    @Override
    public Message<?> postReceive(Message<?> message, MessageChannel channel) {
        LOGGER.info("Message received: {}", message);
        return message;
    }

    @Override
    public void afterReceiveCompletion(Message<?> message, MessageChannel channel, Exception ex) {
        LOGGER.info("After message received: {}", message);
    }
}
