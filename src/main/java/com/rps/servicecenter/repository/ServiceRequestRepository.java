package com.rps.servicecenter.repository;

import com.rps.servicecenter.model.ServiceRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    
    @EntityGraph(attributePaths = {"vehicle", "vehicle.customer", "jobs", "jobs.user"})
    @Override
    List<ServiceRequest> findAll();
    
    @EntityGraph(attributePaths = {"vehicle", "vehicle.customer", "jobs", "jobs.user"})
    @Override
    Optional<ServiceRequest> findById(Long id);
}



