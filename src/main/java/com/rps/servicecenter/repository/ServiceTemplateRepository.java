package com.rps.servicecenter.repository;

import com.rps.servicecenter.model.ServiceTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceTemplateRepository extends JpaRepository<ServiceTemplate, Long> {
    List<ServiceTemplate> findByActiveTrue();
    boolean existsByName(String name);
}

