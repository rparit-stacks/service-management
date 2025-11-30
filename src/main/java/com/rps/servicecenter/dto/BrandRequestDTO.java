package com.rps.servicecenter.dto;

import jakarta.validation.constraints.NotBlank;

public class BrandRequestDTO {
    @NotBlank(message = "Brand name is required")
    private String name;

    private String description;

    private String country;

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

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}






