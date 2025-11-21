package com.rps.servicecenter.controller;

import com.rps.servicecenter.dto.BrandRequestDTO;
import com.rps.servicecenter.dto.BrandResponseDTO;
import com.rps.servicecenter.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping
    public ResponseEntity<List<BrandResponseDTO>> getAllBrands() {
        List<BrandResponseDTO> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BrandResponseDTO> getBrandById(@PathVariable Long id) {
        BrandResponseDTO brand = brandService.getBrandById(id);
        return ResponseEntity.ok(brand);
    }

    @PostMapping
    public ResponseEntity<BrandResponseDTO> createBrand(@Valid @RequestBody BrandRequestDTO brandRequestDTO) {
        BrandResponseDTO savedBrand = brandService.saveBrand(brandRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBrand);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BrandResponseDTO> updateBrand(@PathVariable Long id, @Valid @RequestBody BrandRequestDTO brandRequestDTO) {
        BrandResponseDTO updatedBrand = brandService.updateBrand(id, brandRequestDTO);
        return ResponseEntity.ok(updatedBrand);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }
}





