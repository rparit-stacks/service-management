package com.rps.servicecenter.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Entity
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @NotBlank(message = "Status is required")
    private String status;

    @JsonIgnore
    @NotNull(message = "Vehicle is required")
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @JsonIgnore
    @OneToMany(mappedBy = "serviceRequest", cascade = CascadeType.ALL)
    private List<Service> jobs;


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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public List<Service> getJobs() {
        return jobs;
    }

    public void setJobs(List<Service> jobs) {
        this.jobs = jobs;
    }
}
