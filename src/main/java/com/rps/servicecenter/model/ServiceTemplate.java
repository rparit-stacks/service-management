package com.rps.servicecenter.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "service_templates")
public class ServiceTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Service name is required")
    @Column(unique = true)
    private String name;

    private String description;

    @NotNull(message = "Default cost is required")
    @PositiveOrZero(message = "Default cost must be positive or zero")
    private Double defaultCost;

    private Boolean active = true;

    public ServiceTemplate() {
    }

    public ServiceTemplate(String name, String description, Double defaultCost) {
        this.name = name;
        this.description = description;
        this.defaultCost = defaultCost;
        this.active = true;
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

