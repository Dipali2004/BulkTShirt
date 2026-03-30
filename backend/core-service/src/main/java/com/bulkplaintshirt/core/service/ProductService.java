package com.bulkplaintshirt.core.service;

import com.bulkplaintshirt.core.dto.ProductDto;
import com.bulkplaintshirt.core.exception.ApiException;
import com.bulkplaintshirt.core.model.Product;
import com.bulkplaintshirt.core.repository.ProductRepository;
import com.bulkplaintshirt.core.service.interfaces.IProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService implements IProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found", "PRODUCT_NOT_FOUND"));
        return convertToDto(product);
    }

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = convertToEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Override
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found", "PRODUCT_NOT_FOUND"));
        
        existingProduct.setName(productDto.getName());
        existingProduct.setDescription(productDto.getDescription());
        existingProduct.setPriceMoreThan9(productDto.getPriceMoreThan9());
        existingProduct.setPriceLessThan9(productDto.getPriceLessThan9());
        existingProduct.setSize(productDto.getSize());
        existingProduct.setColor(productDto.getColor());
        existingProduct.setMaterial(productDto.getMaterial());
        existingProduct.setImageUrl(productDto.getImageUrl());
        existingProduct.setStockQuantity(productDto.getStockQuantity());
        
        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDto(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ApiException("Product not found", "PRODUCT_NOT_FOUND");
        }
        productRepository.deleteById(id);
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPriceMoreThan9(product.getPriceMoreThan9());
        dto.setPriceLessThan9(product.getPriceLessThan9());
        dto.setSize(product.getSize());
        dto.setColor(product.getColor());
        dto.setMaterial(product.getMaterial());
        dto.setImageUrl(product.getImageUrl());
        dto.setStockQuantity(product.getStockQuantity());
        return dto;
    }

    private Product convertToEntity(ProductDto dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPriceMoreThan9(dto.getPriceMoreThan9());
        product.setPriceLessThan9(dto.getPriceLessThan9());
        product.setSize(dto.getSize());
        product.setColor(dto.getColor());
        product.setMaterial(dto.getMaterial());
        product.setImageUrl(dto.getImageUrl());
        product.setStockQuantity(dto.getStockQuantity());
        return product;
    }
}
