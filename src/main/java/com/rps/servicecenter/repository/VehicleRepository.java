package com.rps.servicecenter.repository;

import com.rps.servicecenter.model.Vehicle;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    @EntityGraph(attributePaths = {"customer", "brand"})
    @Override
    List<Vehicle> findAll();
    
    @EntityGraph(attributePaths = {"customer", "brand"})
    @Override
    java.util.Optional<Vehicle> findById(Long id);
}



