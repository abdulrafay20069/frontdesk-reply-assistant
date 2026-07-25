package com.frontdesk.service;

import com.frontdesk.entity.BusinessProfile;
import com.frontdesk.entity.BusinessProfileTone;
import com.frontdesk.exception.AIGenerationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class GroqAIService implements AIService {

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "llama-3.3-70b-versatile";
    private static final Duration TIMEOUT = Duration.ofSeconds(15);

    private final HttpClient httpClient;
    private final String apiKey;

    public GroqAIService(@Value("${groq.api.key}") String apiKey) {
        this.apiKey = apiKey;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(TIMEOUT)
                .build();
    }

    @Override
    public String generateDraft(String inquiryText, BusinessProfile profile) throws AIGenerationException {
        String toneDescription = mapToneToDescription(profile.getTone());
        String systemPrompt = String.format(
                "You are a customer support assistant for %s. %s Your tone is %s. " +
                "Use the following FAQ context when relevant to the inquiry: %s " +
                "Write a reply to the customer message below. Keep it concise: 2 to 5 sentences. " +
                "Use no markdown formatting. Sign off with the business name.",
                profile.getBusinessName(),
                profile.getDescription() != null ? profile.getDescription() : "",
                toneDescription,
                profile.getFaqContext() != null ? profile.getFaqContext() : ""
        );

        String requestBody = buildRequestBody(systemPrompt, inquiryText);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GROQ_API_URL))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .timeout(TIMEOUT)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new AIGenerationException("Groq API returned status " + response.statusCode()
                        + ": " + response.body());
            }

            return parseContent(response.body());
        } catch (AIGenerationException e) {
            throw e;
        } catch (Exception e) {
            throw new AIGenerationException("Failed to generate draft: " + e.getMessage(), e);
        }
    }

    private String mapToneToDescription(BusinessProfileTone tone) {
        switch (tone) {
            case WARM_FRIENDLY:
                return "warm, friendly, and conversational";
            case FORMAL_PROFESSIONAL:
                return "formal, professional, and precise";
            case DIRECT_EFFICIENT:
                return "direct, efficient, and to the point";
            default:
                return "warm, friendly, and conversational";
        }
    }

    private String buildRequestBody(String systemPrompt, String userMessage) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"model\": \"").append(MODEL).append("\",");
        json.append("\"messages\": [");
        json.append("{\"role\": \"system\", \"content\": \"").append(escapeJson(systemPrompt)).append("\"},");
        json.append("{\"role\": \"user\", \"content\": \"").append(escapeJson(userMessage)).append("\"}");
        json.append("]");
        json.append("}");
        return json.toString();
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    static String parseContent(String responseBody) throws AIGenerationException {
        try {
            String choicesKey = "\"choices\"";
            int choicesIndex = responseBody.indexOf(choicesKey);
            if (choicesIndex == -1) {
                throw new AIGenerationException("Cannot find 'choices' in response");
            }

            int contentKeyIndex = responseBody.indexOf("\"content\"", choicesIndex);
            if (contentKeyIndex == -1) {
                throw new AIGenerationException("Cannot find 'content' in response choices");
            }

            int colonIndex = responseBody.indexOf(':', contentKeyIndex);
            int firstQuote = responseBody.indexOf('"', colonIndex + 1);
            if (firstQuote == -1) {
                throw new AIGenerationException("Cannot find opening quote for content");
            }

            StringBuilder content = new StringBuilder();
            int i = firstQuote + 1;
            while (i < responseBody.length()) {
                char c = responseBody.charAt(i);
                if (c == '\\') {
                    if (i + 1 < responseBody.length()) {
                        char next = responseBody.charAt(i + 1);
                        if (next == '"') {
                            content.append('"');
                            i += 2;
                            continue;
                        }
                        if (next == 'n') {
                            content.append('\n');
                            i += 2;
                            continue;
                        }
                        if (next == '\\') {
                            content.append('\\');
                            i += 2;
                            continue;
                        }
                    }
                    content.append(c);
                    i++;
                } else if (c == '"') {
                    break;
                } else {
                    content.append(c);
                    i++;
                }
            }

            if (i >= responseBody.length() && content.length() == 0) {
                throw new AIGenerationException("Cannot find closing quote for content");
            }

            return content.toString().trim();
        } catch (AIGenerationException e) {
            throw e;
        } catch (Exception e) {
            throw new AIGenerationException("Failed to parse response: " + e.getMessage(), e);
        }
    }
}
