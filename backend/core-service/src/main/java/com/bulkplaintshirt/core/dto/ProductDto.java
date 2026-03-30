package com.bulkplaintshirt.core.dto;

import java.math.BigDecimal;

public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal priceMoreThan9;
    private BigDecimal priceLessThan9;
    private String size;
    private String color;
    private String material;
    private String imageUrl;
    private int stockQuantity;

    public ProductDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPriceMoreThan9() { return priceMoreThan9; }
    public void setPriceMoreThan9(BigDecimal priceMoreThan9) { this.priceMoreThan9 = priceMoreThan9; }
    public BigDecimal getPriceLessThan9() { return priceLessThan9; }
    public void setPriceLessThan9(BigDecimal priceLessThan9) { this.priceLessThan9 = priceLessThan9; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }
}
