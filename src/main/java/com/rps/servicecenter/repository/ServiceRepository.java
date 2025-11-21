package com.rps.servicecenter.repository;

import com.rps.servicecenter.model.Service;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    
    @EntityGraph(attributePaths = {"serviceRequest", "user"})
    @Override
    List<Service> findAll();
    
    @EntityGraph(attributePaths = {"serviceRequest", "user"})
    @Override
    Optional<Service> findById(Long id);
}



