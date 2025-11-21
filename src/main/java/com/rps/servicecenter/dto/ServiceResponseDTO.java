package com.rps.servicecenter.dto;

public class ServiceResponseDTO {
    private Long id;
    private String description;
    private String jobName;
    private Double cost;
    private Long serviceRequestId;
    private Long userId;
    private String userName;
    private Long serviceTemplateId;
    private String serviceTemplateName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getServiceTemplateId() {
        return serviceTemplateId;
    }

    public void setServiceTemplateId(Long serviceTemplateId) {
        this.serviceTemplateId = serviceTemplateId;
    }

    public String getServiceTemplateName() {
        return serviceTemplateName;
    }

    public void setServiceTemplateName(String serviceTemplateName) {
        this.serviceTemplateName = serviceTemplateName;
    }
}




