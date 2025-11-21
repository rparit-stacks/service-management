package com.rps.servicecenter.service;

import com.rps.servicecenter.dto.BrandRequestDTO;
import com.rps.servicecenter.dto.BrandResponseDTO;

import java.util.List;

public interface BrandService {
    List<BrandResponseDTO> getAllBrands();
    BrandResponseDTO getBrandById(Long id);
    BrandResponseDTO saveBrand(BrandRequestDTO brandRequestDTO);
    BrandResponseDTO updateBrand(Long id, BrandRequestDTO brandRequestDTO);
    void deleteBrand(Long id);
}





