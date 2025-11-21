package com.rps.servicecenter.repository;

import com.rps.servicecenter.model.Invoice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    @EntityGraph(attributePaths = {"customer", "vehicle", "serviceRequest", "serviceRequest.jobs", "serviceRequest.jobs.user"})
    @Override
    List<Invoice> findAll();
    
    @EntityGraph(attributePaths = {"customer", "vehicle", "serviceRequest", "serviceRequest.jobs", "serviceRequest.jobs.user"})
    @Override
    Optional<Invoice> findById(Long id);
    
    @EntityGraph(attributePaths = {"customer", "vehicle", "serviceRequest", "serviceRequest.jobs", "serviceRequest.jobs.user"})
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    @EntityGraph(attributePaths = {"customer", "vehicle", "serviceRequest", "serviceRequest.jobs", "serviceRequest.jobs.user"})
    List<Invoice> findByCustomerId(Long customerId);
    
    @EntityGraph(attributePaths = {"customer", "vehicle", "serviceRequest", "serviceRequest.jobs", "serviceRequest.jobs.user"})
    List<Invoice> findByServiceRequestId(Long serviceRequestId);
    
    boolean existsByInvoiceNumber(String invoiceNumber);
}

