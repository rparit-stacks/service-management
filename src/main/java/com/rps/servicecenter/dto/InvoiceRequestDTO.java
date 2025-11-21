package com.rps.servicecenter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class InvoiceRequestDTO {
    @NotNull(message = "Service request ID is required")
    private Long serviceRequestId;

    @PositiveOrZero(message = "Tax must be positive or zero")
    private Double tax = 0.0;

    @PositiveOrZero(message = "Discount must be positive or zero")
    private Double discount = 0.0;

    @NotBlank(message = "Payment status is required")
    private String paymentStatus = "UNPAID"; // PAID, UNPAID

    private String notes;

    private Integer dueDays; // Number of days from today for due date

    public Long getServiceRequestId() {
        return serviceRequestId;
    }

    public void setServiceRequestId(Long serviceRequestId) {
        this.serviceRequestId = serviceRequestId;
    }

    public Double getTax() {
        return tax;
    }

    public void setTax(Double tax) {
        this.tax = tax;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Integer getDueDays() {
        return dueDays;
    }

    public void setDueDays(Integer dueDays) {
        this.dueDays = dueDays;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}

