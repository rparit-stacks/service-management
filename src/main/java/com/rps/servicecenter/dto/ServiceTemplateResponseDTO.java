package com.rps.servicecenter.dto;

public class ServiceTemplateResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Double defaultCost;
    private Boolean active;

    public ServiceTemplateResponseDTO() {
    }

    public ServiceTemplateResponseDTO(Long id, String name, String description, Double defaultCost, Boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.defaultCost = defaultCost;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

