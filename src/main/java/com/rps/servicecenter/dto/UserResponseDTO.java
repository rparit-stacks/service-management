package com.rps.servicecenter.dto;

import java.util.List;

public class UserResponseDTO {
    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private List<ServiceResponseDTO> jobs;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<ServiceResponseDTO> getJobs() {
        return jobs;
    }

    public void setJobs(List<ServiceResponseDTO> jobs) {
        this.jobs = jobs;
    }
}






