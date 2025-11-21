package com.rps.servicecenter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class ServiceTemplateRequestDTO {
    @NotBlank(message = "Service name is required")
    private String name;

    private String description;

    @NotNull(message = "Default cost is required")
    @PositiveOrZero(message = "Default cost must be positive or zero")
    private Double defaultCost;

    private Boolean active = true;

    public ServiceTemplateRequestDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getDefaultCost() {
        return defaultCost;
    }

    public void setDefaultCost(Double defaultCost) {
        this.defaultCost = defaultCost;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}

