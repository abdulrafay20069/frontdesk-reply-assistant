package com.frontdesk.exception;

public class DraftGenerationFailedException extends RuntimeException {

    public DraftGenerationFailedException(String message, Throwable cause) {
        super(message, cause);
    }
}
