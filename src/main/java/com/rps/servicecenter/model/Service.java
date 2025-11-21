package com.rps.servicecenter.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;


@Entity
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @NotBlank(message = "Job name is required")
    private String jobName;

    @NotNull(message = "Cost is required")
    @PositiveOrZero(message = "Cost must be positive or zero")
    private Double cost;

    @JsonIgnore
    @NotNull(message = "Service request is required")
    @ManyToOne
    @JoinColumn(name = "service_request_id")
    private ServiceRequest serviceRequest;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user; // Optional: can be null

    @ManyToOne
    @JoinColumn(name = "service_template_id")
    private ServiceTemplate serviceTemplate;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

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

    public ServiceRequest getServiceRequest() {
        return serviceRequest;
    }

    public void setServiceRequest(ServiceRequest serviceRequest) {
        this.serviceRequest = serviceRequest;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ServiceTemplate getServiceTemplate() {
        return serviceTemplate;
    }

    public void setServiceTemplate(ServiceTemplate serviceTemplate) {
        this.serviceTemplate = serviceTemplate;
    }
}
