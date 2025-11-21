package com.rps.servicecenter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class ServiceDTO {
    private String description;

    @NotBlank(message = "Job name is required")
    private String jobName;

    @NotNull(message = "Cost is required")
    @PositiveOrZero(message = "Cost must be positive or zero")
    private Double cost;

    @NotNull(message = "Service request ID is required")
    private Long serviceRequestId;

    private Long userId; // Optional: can be null

    private Long serviceTemplateId; // Optional: link to service template

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Long getServiceRequestId() {
        return serviceRequestId;
    }

    public void setServiceRequestId(Long serviceRequestId) {
        this.serviceRequestId = serviceRequestId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getServiceTemplateId() {
        return serviceTemplateId;
    }

    public void setServiceTemplateId(Long serviceTemplateId) {
        this.serviceTemplateId = serviceTemplateId;
    }
}




