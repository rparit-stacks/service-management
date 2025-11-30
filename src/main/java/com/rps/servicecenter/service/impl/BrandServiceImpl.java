package com.rps.servicecenter.service.impl;

import com.rps.servicecenter.dto.BrandRequestDTO;
import com.rps.servicecenter.dto.BrandResponseDTO;
import com.rps.servicecenter.exception.ResourceNotFoundException;
import com.rps.servicecenter.model.Brand;
import com.rps.servicecenter.repository.BrandRepository;
import com.rps.servicecenter.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BrandResponseDTO> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BrandResponseDTO getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", id));
        return toResponseDTO(brand);
    }

    @Override
    public BrandResponseDTO saveBrand(BrandRequestDTO brandRequestDTO) {
        if (brandRepository.existsByName(brandRequestDTO.getName())) {
            throw new RuntimeException("Brand with name '" + brandRequestDTO.getName() + "' already exists");
        }

        Brand brand = toEntity(brandRequestDTO);
        Brand savedBrand = brandRepository.save(brand);
        return toResponseDTO(savedBrand);
    }

    @Override
    public BrandResponseDTO updateBrand(Long id, BrandRequestDTO brandRequestDTO) {
        Brand existingBrand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", id));

        // Check if name is being changed and if new name already exists
        if (!existingBrand.getName().equals(brandRequestDTO.getName()) &&
            brandRepository.existsByName(brandRequestDTO.getName())) {
            throw new RuntimeException("Brand with name '" + brandRequestDTO.getName() + "' already exists");
        }

        existingBrand.setName(brandRequestDTO.getName());
        existingBrand.setDescription(brandRequestDTO.getDescription());
        existingBrand.setCountry(brandRequestDTO.getCountry());
        
        Brand updatedBrand = brandRepository.save(existingBrand);
        return toResponseDTO(updatedBrand);
    }

    @Override
    public void deleteBrand(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new ResourceNotFoundException("Brand", id);
        }
        brandRepository.deleteById(id);
    }

    private Brand toEntity(BrandRequestDTO dto) {
        Brand brand = new Brand();
        brand.setName(dto.getName());
        brand.setDescription(dto.getDescription());
        brand.setCountry(dto.getCountry());
        return brand;
    }

    private BrandResponseDTO toResponseDTO(Brand brand) {
        BrandResponseDTO dto = new BrandResponseDTO();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setDescription(brand.getDescription());
        dto.setCountry(brand.getCountry());
        return dto;
    }
}






