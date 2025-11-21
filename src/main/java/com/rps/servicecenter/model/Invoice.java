package com.rps.servicecenter.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

/**
 * Invoice Entity
 * Invoice is generated from ServiceRequest
 * Contains all services performed and total amount
 */
@Entity
@Table(name = "invoices")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Invoice number is required")
    @Column(unique = true, nullable = false)
    private String invoiceNumber;

    @NotNull(message = "Service request is required")
    @ManyToOne
    @JoinColumn(name = "service_request_id", nullable = false)
    @JsonIgnore
    private ServiceRequest serviceRequest;

    @NotNull(message = "Customer is required")
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnore
    private Customer customer;

    @NotNull(message = "Vehicle is required")
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    @JsonIgnore
    private Vehicle vehicle;

    @NotNull(message = "Subtotal is required")
    @PositiveOrZero(message = "Subtotal must be positive or zero")
    private Double subtotal;

    @PositiveOrZero(message = "Tax must be positive or zero")
    private Double tax = 0.0;

    @PositiveOrZero(message = "Discount must be positive or zero")
    private Double discount = 0.0;

    @NotNull(message = "Total amount is required")
    @PositiveOrZero(message = "Total amount must be positive or zero")
    private Double totalAmount;

    @NotBlank(message = "Payment status is required")
    private String paymentStatus = "UNPAID"; // PAID, UNPAID

    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime dueDate;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public ServiceRequest getServiceRequest() {
        return serviceRequest;
    }

    public void setServiceRequest(ServiceRequest serviceRequest) {
        this.serviceRequest = serviceRequest;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
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

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
}

