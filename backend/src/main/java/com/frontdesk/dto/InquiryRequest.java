package com.frontdesk.dto;

import com.frontdesk.entity.InquiryChannel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InquiryRequest {

    @NotBlank
    private String customerName;

    @NotBlank
    private String customerEmail;

    @NotNull
    private InquiryChannel channel;

    @NotBlank
    private String messageText;

    public InquiryRequest() {
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public InquiryChannel getChannel() {
        return channel;
    }

    public void setChannel(InquiryChannel channel) {
        this.channel = channel;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }
}
