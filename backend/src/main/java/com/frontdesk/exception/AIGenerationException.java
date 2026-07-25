package com.frontdesk.exception;

public class AIGenerationException extends Exception {

    public AIGenerationException(String message) {
        super(message);
    }

    public AIGenerationException(String message, Throwable cause) {
        super(message, cause);
    }
}
